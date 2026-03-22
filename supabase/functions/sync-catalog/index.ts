import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SS_BASE = "https://api.ssactivewear.com/v2";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ssKey = Deno.env.get("SS_API_KEY");
  const ssAccount = Deno.env.get("SS_ACCOUNT_NUMBER");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!ssKey || !ssAccount) {
    return new Response(
      JSON.stringify({ error: "SS credentials not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const authHeader = "Basic " + btoa(`${ssAccount}:${ssKey}`);
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "styles"; 

    if (mode === "styles") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const perPage = 100;
      
      console.log(`Fetching styles page ${page}...`);
      const ssResp = await fetch(
        `${SS_BASE}/styles/?page=${page}&perPage=${perPage}`,
        { headers: { Authorization: authHeader, Accept: "application/json" } }
      );

      if (!ssResp.ok) {
        return new Response(
          JSON.stringify({ error: `SS API returned ${ssResp.status}` }),
          { status: ssResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const styles = await ssResp.json();
      if (!Array.isArray(styles) || styles.length === 0) {
        return new Response(
          JSON.stringify({ success: true, synced: 0, hasMore: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rows = styles.map((s: any) => ({
        style_id: s.styleID ?? s.StyleID ?? 0,
        title: s.title ?? s.Title ?? "",
        brand_name: s.brandName ?? s.BrandName ?? "",
        base_category: s.baseCategory ?? s.BaseCategory ?? "",
        description: s.description ?? s.Description ?? "",
        style_image_url: null,
        colors: [],
        sizes: [],
        pricing: {},
        total_skus: 0,
        raw_categories: s.baseCategory ?? "",
        updated_at: new Date().toISOString(),
      })).filter((r: any) => r.style_id > 0);

      const { error } = await supabase
        .from("ss_catalog_cache")
        .upsert(rows, { onConflict: "style_id", ignoreDuplicates: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, synced: rows.length, hasMore: styles.length >= perPage, nextPage: page + 1 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mode === "detail") {
      // Enrich metadata ONLY (colors, sizes, pricing) — NO image downloads
      // Images are handled by external script (Manus/local) due to Cloudflare blocking
      const limit = parseInt(url.searchParams.get("limit") || "10");
      
      const { data: rows } = await supabase
        .from("ss_catalog_cache")
        .select("style_id")
        .eq("total_skus", 0)
        .limit(limit);

      if (!rows || rows.length === 0) {
        return new Response(
          JSON.stringify({ success: true, enriched: 0, remaining: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let enriched = 0;

      for (const row of rows as any[]) {
        try {
          const prodResp = await fetch(
            `${SS_BASE}/products/?styleID=${row.style_id}`,
            { headers: { Authorization: authHeader, Accept: "application/json" } }
          );

          if (!prodResp.ok) continue;

          const products = await prodResp.json();
          if (!Array.isArray(products) || products.length === 0) {
            await supabase.from("ss_catalog_cache").update({ total_skus: -1 }).eq("style_id", row.style_id);
            continue;
          }

          const colorMap = new Map<string, any>();
          const sizeSet = new Set<string>();
          let minCust = Infinity, maxCust = 0, minPiece = Infinity, maxPiece = 0;

          for (const p of products) {
            const colorName = p.colorName || p.ColorName || "";
            const hex = p.color1 || p.Color1 || "888888";
            const frontImg = p.colorFrontImage || p.ColorFrontImage || null;
            const backImg = p.colorBackImage || p.ColorBackImage || null;
            const sizeName = p.sizeName || p.SizeName || "";
            const custPrice = p.customerPrice || p.CustomerPrice || 0;
            const piecePrice = p.piecePrice || p.PiecePrice || 0;

            if (colorName && !colorMap.has(colorName)) {
              colorMap.set(colorName, {
                name: colorName,
                hex: `#${hex.replace(/^#/, "")}`,
                // Store raw S&S image paths for the external script to process
                rawFrontImg: frontImg,
                rawBackImg: backImg,
              });
            }
            if (sizeName) sizeSet.add(sizeName);
            if (custPrice > 0) { minCust = Math.min(minCust, custPrice); maxCust = Math.max(maxCust, custPrice); }
            if (piecePrice > 0) { minPiece = Math.min(minPiece, piecePrice); maxPiece = Math.max(maxPiece, piecePrice); }
          }

          const colorEntries = Array.from(colorMap.values());
          const cachedColors = colorEntries.map((color) => ({
            name: color.name,
            hex: color.hex,
            imageUrl: null,       // Will be populated by external image script
            backImageUrl: null,   // Will be populated by external image script
            rawFrontImg: color.rawFrontImg,  // Keep raw path for script reference
            rawBackImg: color.rawBackImg,
          }));

          await supabase.from("ss_catalog_cache").update({
            colors: cachedColors,
            sizes: Array.from(sizeSet),
            pricing: {
              customerPrice: { min: minCust === Infinity ? 0 : minCust, max: maxCust },
              piecePrice: { min: minPiece === Infinity ? 0 : minPiece, max: maxPiece },
            },
            total_skus: products.length,
            style_image_url: null,
            description: products[0]?.description || products[0]?.Description || "",
            updated_at: new Date().toISOString(),
          }).eq("style_id", row.style_id);

          enriched++;
          console.log(`Enriched style ${row.style_id} — colors: ${cachedColors.length}, sizes: ${sizeSet.size}`);
        } catch (e) {
          console.warn(`Failed to enrich style ${row.style_id}:`, e);
        }
        await sleep(200);
      }

      const { count } = await supabase.from("ss_catalog_cache").select("style_id", { count: "exact", head: true }).eq("total_skus", 0);

      return new Response(
        JSON.stringify({ success: true, enriched, remaining: count || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown mode: ${mode}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("sync-catalog error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
