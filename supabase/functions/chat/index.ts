import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function fetchProjects(): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("projects")
    .select("title, slug, description, location_city, location_zone, project_type, status, price_from, price_currency, estimated_yield, delivery_date, financing_available, amenities, developer_name, cover_image_url")
    .order("featured", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return "No se pudieron cargar los proyectos.";
  }

  if (!data || data.length === 0) return "No hay proyectos disponibles actualmente.";

  const statusMap: Record<string, string> = {
    en_pozo: "En pozo",
    en_construccion: "En construcción",
    entrega_inmediata: "Entrega inmediata",
  };
  const typeMap: Record<string, string> = {
    departamentos: "Departamentos",
    casas: "Casas",
    barrio_cerrado: "Barrio cerrado",
    mixto: "Mixto",
  };

  return data.map((p) => {
    const lines = [
      `- **${p.title}** (${typeMap[p.project_type] || p.project_type})`,
      `  Ciudad: ${p.location_city}${p.location_zone ? `, zona ${p.location_zone}` : ""}`,
      `  Estado: ${statusMap[p.status] || p.status}`,
      p.price_from ? `  Precio desde: ${p.price_currency} ${p.price_from.toLocaleString()}` : null,
      p.estimated_yield ? `  Rentabilidad estimada: ${p.estimated_yield}%` : null,
      p.delivery_date ? `  Entrega: ${p.delivery_date}` : null,
      p.financing_available ? `  Financiación disponible: Sí` : null,
      p.developer_name ? `  Desarrolladora: ${p.developer_name}` : null,
      p.amenities?.length ? `  Amenities: ${p.amenities.join(", ")}` : null,
      `  🔗 Ver más: /proyecto/${p.slug}`,
    ];
    return lines.filter(Boolean).join("\n");
  }).join("\n\n");
}

const LANG_INSTRUCTIONS: Record<string, string> = {
  es: "Respondé siempre en español, con tono profesional pero cercano.",
  en: "Always respond in English, with a professional yet approachable tone.",
  de: "Antworte immer auf Deutsch, mit einem professionellen aber freundlichen Ton.",
  fr: "Réponds toujours en français, avec un ton professionnel mais accessible.",
};

function buildSystemPrompt(lang: string, projectsText: string): string {
  const langRule = LANG_INSTRUCTIONS[lang] || LANG_INSTRUCTIONS["es"];
  
  return `You are a virtual real estate assistant for Takoha, the leading new-build project platform in Paraguay.

Your role:
- Help users find real estate projects that match their needs
- Recommend specific projects based on the real data you have available
- Answer questions about project types (apartments, houses, gated communities)
- Explain construction stages (off-plan, under construction, ready to move in)
- Guide users on real estate investment in Paraguay
- Guide developers on how to publish their projects on the platform

Rules:
- ${langRule}
- Be concise: maximum 4-5 sentences unless the user asks for more detail
- Use the real project data listed below for recommendations
- When recommending a project, include the link in markdown format: [Project Name](/proyecto/slug)
- If the user searches for something that doesn't match any project, be honest and suggest the closest options
- You can compare projects if the user asks
- If they ask about prices, returns, or location, use real data

## PROJECT CARDS:
When recommending one or more specific projects, add the tag [PROJECT_CARDS:slug1,slug2] at the end of your response with the slugs of the recommended projects (maximum 3). This will display visual cards with image, price and link. Only use this tag when making concrete project recommendations.

## FOLLOW-UP SUGGESTIONS:
At the end of EVERY response, add the tag [SUGGESTIONS:suggestion1|suggestion2|suggestion3] with 2-3 follow-up questions relevant to the conversation topic. They must be short (maximum 5 words each). Write them in the same language you are responding in. Don't repeat suggestions that have already been used.

## LEAD CAPTURE:
When you detect that the user shows concrete interest in a project (asks about prices, availability, wants more information, asks to contact an advisor, says they're interested, wants to schedule a visit, etc.), add the tag [SHOW_CONTACT_FORM] at the end of your response. This will automatically open a contact form in the chat. Only use this tag ONCE per conversation, and only when the interest is clear. Don't use it if the user is only asking general questions.

## AVAILABLE PROJECTS ON THE PLATFORM:

${projectsText}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lang } = await req.json();
    const userLang = lang || "es";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch real projects from DB
    const projectsText = await fetchProjects();
    const systemPrompt = buildSystemPrompt(userLang, projectsText);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Intentá de nuevo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio no disponible temporalmente." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Error del servicio de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
