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
    .select("title, slug, description, location_city, location_zone, project_type, status, price_from, price_currency, estimated_yield, delivery_date, financing_available, amenities, developer_name")
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

const SYSTEM_PROMPT_TEMPLATE = `Sos un asistente inmobiliario virtual de ProyectPY, la plataforma líder de proyectos de obra nueva en Paraguay.

Tu rol:
- Ayudar a los usuarios a encontrar proyectos inmobiliarios que se ajusten a sus necesidades
- Recomendar proyectos específicos basándote en los datos reales que tenés disponibles
- Responder preguntas sobre tipos de proyectos (departamentos, casas, barrios cerrados)
- Explicar los estados de obra (en pozo, en construcción, entrega inmediata)
- Orientar sobre inversión inmobiliaria en Paraguay
- Guiar a promotores sobre cómo publicar sus proyectos en la plataforma

Reglas:
- Respondé siempre en español, con tono profesional pero cercano
- Sé conciso: respuestas de máximo 4-5 oraciones salvo que el usuario pida más detalle
- Usá los datos reales de los proyectos listados abajo para hacer recomendaciones
- Cuando recomiendes un proyecto, incluí el link con formato markdown: [Nombre del Proyecto](/proyecto/slug)
- Si el usuario busca algo que no coincide con ningún proyecto, decíselo honestamente y sugerí las opciones más cercanas
- Podés comparar proyectos si el usuario lo pide
- Si preguntan por precios, rentabilidad o ubicación, usá los datos reales

## CAPTURA DE LEADS:
Cuando detectes que el usuario muestra interés concreto en un proyecto (pregunta por precios, disponibilidad, quiere más información, pide contacto con un asesor, dice que le interesa, quiere agendar una visita, etc.), agregá la etiqueta [SHOW_CONTACT_FORM] al final de tu respuesta. Esto abrirá automáticamente un formulario de contacto en el chat. Solo usá esta etiqueta UNA VEZ por conversación, y solo cuando el interés sea claro. No la uses si el usuario solo hace preguntas generales.

## PROYECTOS DISPONIBLES EN LA PLATAFORMA:

{{PROJECTS}}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch real projects from DB
    const projectsText = await fetchProjects();
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace("{{PROJECTS}}", projectsText);

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
