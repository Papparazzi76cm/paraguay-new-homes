import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // --- Auth via X-API-Key header ---
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return jsonResponse(401, { error: "Missing X-API-Key header" });
  }

  const { data: developerId, error: authErr } = await supabaseAdmin.rpc(
    "validate_api_key",
    { _api_key: apiKey }
  );
  if (authErr || !developerId) {
    return jsonResponse(403, { error: "Invalid or revoked API key" });
  }

  // Update last_used_at
  await supabaseAdmin
    .from("developer_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("api_key", apiKey);

  // --- Routing ---
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/crm-sync\/?/, "");
  const method = req.method;

  let result: Response;

  try {
    if (path === "projects" && method === "GET") {
      result = await handleGetProjects(supabaseAdmin, developerId);
    } else if (path === "projects" && method === "PUT") {
      result = await handleUpsertProject(supabaseAdmin, developerId, req);
    } else if (path.startsWith("projects/") && path.endsWith("/units") && method === "PUT") {
      const slug = path.replace("projects/", "").replace("/units", "");
      result = await handleUpsertUnits(supabaseAdmin, developerId, slug, req);
    } else if (path === "units/availability" && method === "PATCH") {
      result = await handleBulkAvailability(supabaseAdmin, developerId, req);
    } else if (path === "projects" && method === "PATCH") {
      result = await handleUpdateProjectStatus(supabaseAdmin, developerId, req);
    } else {
      result = jsonResponse(404, {
        error: "Unknown endpoint",
        available_endpoints: {
          "GET /projects": "List your projects",
          "PUT /projects": "Create or update a project",
          "PUT /projects/{slug}/units": "Upsert units for a project",
          "PATCH /units/availability": "Bulk update unit availability",
          "PATCH /projects": "Update project status/phases/pricing",
        },
      });
    }
  } catch (e) {
    console.error("CRM Sync error:", e);
    result = jsonResponse(500, { error: "Internal server error" });
  }

  // Log the sync
  await supabaseAdmin.from("crm_sync_logs").insert({
    developer_id: developerId,
    endpoint: path || "/",
    method,
    status_code: result.status,
    request_body: method !== "GET" ? await safeParseBody(req) : null,
    response_summary: result.status < 400 ? "ok" : "error",
  });

  return result;
});

// --- Handlers ---

async function handleGetProjects(sb: any, devId: string) {
  const { data, error } = await sb
    .from("projects")
    .select("id, title, slug, status, project_type, location_city, location_zone, price_from, price_currency, delivery_date, phase_preventa_date, phase_en_pozo_date, phase_construccion_date, phase_entrega_date")
    .eq("developer_id", devId)
    .order("created_at", { ascending: false });

  if (error) return jsonResponse(500, { error: error.message });
  return jsonResponse(200, { projects: data });
}

async function handleUpsertProject(sb: any, devId: string, req: Request) {
  const body = await req.json();
  const required = ["title", "slug", "location_city"];
  for (const field of required) {
    if (!body[field]) return jsonResponse(400, { error: `Missing required field: ${field}` });
  }

  const projectData = {
    title: body.title,
    slug: body.slug,
    description: body.description ?? null,
    location_city: body.location_city,
    location_zone: body.location_zone ?? null,
    project_type: body.project_type ?? "departamentos",
    status: body.status ?? "en_construccion",
    price_from: body.price_from ?? null,
    price_currency: body.price_currency ?? "USD",
    delivery_date: body.delivery_date ?? null,
    financing_available: body.financing_available ?? false,
    estimated_yield: body.estimated_yield ?? null,
    amenities: body.amenities ?? [],
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    cover_image_url: body.cover_image_url ?? null,
    developer_id: devId,
    // Financing fields
    tipo_financiacion: body.tipo_financiacion ?? null,
    programa_financiacion: body.programa_financiacion ?? null,
    entidad_financiera: body.entidad_financiera ?? null,
    precio_financiable: body.precio_financiable ?? null,
    cuota_estimativa: body.cuota_estimativa ?? null,
    plazo_maximo: body.plazo_maximo ?? null,
    subsidio_estado: body.subsidio_estado ?? false,
    // Phase dates
    phase_preventa_date: body.phase_preventa_date ?? null,
    phase_en_pozo_date: body.phase_en_pozo_date ?? null,
    phase_construccion_date: body.phase_construccion_date ?? null,
    phase_entrega_date: body.phase_entrega_date ?? null,
  };

  // Upsert by slug + developer_id
  const { data: existing } = await sb
    .from("projects")
    .select("id")
    .eq("slug", body.slug)
    .eq("developer_id", devId)
    .maybeSingle();

  let result;
  if (existing) {
    const { data, error } = await sb
      .from("projects")
      .update(projectData)
      .eq("id", existing.id)
      .select("id, slug")
      .single();
    if (error) return jsonResponse(500, { error: error.message });
    result = { action: "updated", project: data };
  } else {
    const { data, error } = await sb
      .from("projects")
      .insert(projectData)
      .select("id, slug")
      .single();
    if (error) return jsonResponse(500, { error: error.message });
    result = { action: "created", project: data };
  }

  return jsonResponse(200, result);
}

async function handleUpsertUnits(sb: any, devId: string, slug: string, req: Request) {
  // Verify project belongs to developer
  const { data: project, error: projErr } = await sb
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .eq("developer_id", devId)
    .maybeSingle();

  if (projErr || !project) {
    return jsonResponse(404, { error: "Project not found or not owned by you" });
  }

  const body = await req.json();
  if (!Array.isArray(body.units)) {
    return jsonResponse(400, { error: "Expected { units: [...] }" });
  }

  const results = { created: 0, updated: 0, errors: [] as string[] };

  for (const unit of body.units) {
    if (!unit.unit_name) {
      results.errors.push("Missing unit_name in a unit entry");
      continue;
    }

    const unitData = {
      project_id: project.id,
      unit_name: unit.unit_name,
      typology: unit.typology ?? "monoambiente",
      area_m2: unit.area_m2 ?? null,
      price: unit.price ?? null,
      price_currency: unit.price_currency ?? "USD",
      available: unit.available ?? true,
      floor: unit.floor ?? null,
      unit_type: unit.unit_type ?? null,
    };

    // Upsert by unit_name + project_id
    const { data: existing } = await sb
      .from("project_units")
      .select("id")
      .eq("project_id", project.id)
      .eq("unit_name", unit.unit_name)
      .maybeSingle();

    if (existing) {
      const { error } = await sb
        .from("project_units")
        .update(unitData)
        .eq("id", existing.id);
      if (error) results.errors.push(`Update ${unit.unit_name}: ${error.message}`);
      else results.updated++;
    } else {
      const { error } = await sb
        .from("project_units")
        .insert(unitData);
      if (error) results.errors.push(`Insert ${unit.unit_name}: ${error.message}`);
      else results.created++;
    }
  }

  return jsonResponse(200, results);
}

async function handleBulkAvailability(sb: any, devId: string, req: Request) {
  const body = await req.json();
  if (!Array.isArray(body.updates)) {
    return jsonResponse(400, { error: "Expected { updates: [{ unit_name, project_slug, available }] }" });
  }

  const results = { updated: 0, errors: [] as string[] };

  for (const u of body.updates) {
    if (!u.unit_name || !u.project_slug || u.available === undefined) {
      results.errors.push("Each update needs unit_name, project_slug, available");
      continue;
    }

    const { data: project } = await sb
      .from("projects")
      .select("id")
      .eq("slug", u.project_slug)
      .eq("developer_id", devId)
      .maybeSingle();

    if (!project) {
      results.errors.push(`Project ${u.project_slug} not found`);
      continue;
    }

    const updateData: any = { available: u.available };
    if (u.price !== undefined) updateData.price = u.price;
    if (u.price_currency !== undefined) updateData.price_currency = u.price_currency;

    const { error } = await sb
      .from("project_units")
      .update(updateData)
      .eq("project_id", project.id)
      .eq("unit_name", u.unit_name);

    if (error) results.errors.push(`${u.unit_name}: ${error.message}`);
    else results.updated++;
  }

  return jsonResponse(200, results);
}

async function handleUpdateProjectStatus(sb: any, devId: string, req: Request) {
  const body = await req.json();
  if (!body.slug) return jsonResponse(400, { error: "Missing slug" });

  const allowedFields = [
    "status", "price_from", "delivery_date", "financing_available",
    "phase_preventa_date", "phase_en_pozo_date", "phase_construccion_date",
    "phase_entrega_date", "precio_financiable", "cuota_estimativa",
    "plazo_maximo", "estimated_yield",
  ];

  const updates: any = {};
  for (const f of allowedFields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  if (Object.keys(updates).length === 0) {
    return jsonResponse(400, { error: "No valid fields to update" });
  }

  const { data, error } = await sb
    .from("projects")
    .update(updates)
    .eq("slug", body.slug)
    .eq("developer_id", devId)
    .select("id, slug, status")
    .single();

  if (error) return jsonResponse(500, { error: error.message });
  if (!data) return jsonResponse(404, { error: "Project not found" });

  return jsonResponse(200, { action: "updated", project: data });
}

// --- Helpers ---

function jsonResponse(status: number, body: any): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function safeParseBody(req: Request) {
  try {
    const clone = req.clone();
    return await clone.json();
  } catch {
    return null;
  }
}
