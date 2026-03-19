import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const JPEG_QUALITY = 80;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bucket, path } = await req.json();

    if (!bucket || !path) {
      return new Response(
        JSON.stringify({ error: "Missing bucket or path" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Download original file
    const { data: fileData, error: dlError } = await supabaseAdmin.storage
      .from(bucket)
      .download(path);

    if (dlError || !fileData) {
      return new Response(
        JSON.stringify({ error: "Failed to download file", details: dlError?.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const originalBytes = new Uint8Array(await fileData.arrayBuffer());
    const originalSize = originalBytes.length;

    // If already small (< 200KB), skip optimization
    if (originalSize < 200 * 1024) {
      return new Response(
        JSON.stringify({ optimized: false, reason: "Already small", originalSize }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decode image
    let img: Image;
    try {
      img = await Image.decode(originalBytes);
    } catch {
      return new Response(
        JSON.stringify({ optimized: false, reason: "Unsupported format or decode error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resize if larger than max dimensions
    let resized = false;
    if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
      const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
      const newW = Math.round(img.width * scale);
      const newH = Math.round(img.height * scale);
      img.resize(newW, newH);
      resized = true;
    }

    // Encode as JPEG with quality control
    const optimizedBytes = await img.encodeJPEG(JPEG_QUALITY);
    const optimizedSize = optimizedBytes.length;

    // Only replace if we actually saved space (at least 10%)
    if (optimizedSize >= originalSize * 0.9 && !resized) {
      return new Response(
        JSON.stringify({ optimized: false, reason: "No significant savings", originalSize, optimizedSize }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload optimized version, replacing the original
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .update(path, optimizedBytes, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: "Failed to upload optimized image", details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const savings = Math.round((1 - optimizedSize / originalSize) * 100);

    return new Response(
      JSON.stringify({
        optimized: true,
        originalSize,
        optimizedSize,
        savings: `${savings}%`,
        resized,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("optimize-image error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
