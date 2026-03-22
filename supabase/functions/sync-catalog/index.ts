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
      // Enrich a batch of styles with product data AND images
      const limit = parseInt(url.searchParams.get("limit") || "5");
      
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
              colorMap.set(colorName, { name: colorName, hex: `#${hex.replace(/^#/, "")}`, rawFrontImg: frontImg, rawBackImg: backImg });
            }
            if (sizeName) sizeSet.add(sizeName);
            if (custPrice > 0) { minCust = Math.min(minCust, custPrice); maxCust = Math.max(maxCust, custPrice); }
            if (piecePrice > 0) { minPiece = Math.min(minPiece, piecePrice); maxPiece = Math.max(maxPiece, piecePrice); }
          }

          // Download and cache the FIRST color's front image as the style image
          let styleImageUrl: string | null = null;
          const colorEntries = Array.from(colorMap.values());
          const cachedColors: any[] = [];

          for (const color of colorEntries) {
            let cachedFront: string | null = null;
            let cachedBack: string | null = null;

            // Cache front image
            if (color.rawFrontImg) {
              cachedFront = await downloadAndUploadImage(
                supabase, authHeader, color.rawFrontImg, `colors/${row.style_id}/${encodeURIComponent(color.name)}_front`
              );
            }

            // Cache back image (skip to save time, only do front)
            // if (color.rawBackImg) { ... }

            // Use first successful front image as style image
            if (cachedFront && !styleImageUrl) {
              styleImageUrl = cachedFront;
            }

            cachedColors.push({
              name: color.name,
              hex: color.hex,
              imageUrl: cachedFront,
              backImageUrl: cachedBack,
            });
          }

          // If no color image worked, try the style image path
          if (!styleImageUrl) {
            styleImageUrl = await downloadAndUploadImage(
              supabase, authHeader, `Images/Style/${row.style_id}_fm.jpg`, `styles/${row.style_id}`
            );
          }

          await supabase.from("ss_catalog_cache").update({
            colors: cachedColors,
            sizes: Array.from(sizeSet),
            pricing: {
              customerPrice: { min: minCust === Infinity ? 0 : minCust, max: maxCust },
              piecePrice: { min: minPiece === Infinity ? 0 : minPiece, max: maxPiece },
            },
            total_skus: products.length,
            style_image_url: styleImageUrl,
            description: products[0]?.description || products[0]?.Description || "",
            updated_at: new Date().toISOString(),
          }).eq("style_id", row.style_id);

          enriched++;
          console.log(`Enriched style ${row.style_id} — image: ${styleImageUrl ? 'yes' : 'no'}, colors: ${cachedColors.length}`);
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

    if (mode === "images") {
      // Repair/backfill: re-download images for enriched styles missing style_image_url
      const limit = parseInt(url.searchParams.get("limit") || "10");

      const { data: rows } = await supabase
        .from("ss_catalog_cache")
        .select("style_id, colors")
        .is("style_image_url", null)
        .gt("total_skus", 0)
        .limit(limit);

      if (!rows || rows.length === 0) {
        return new Response(
          JSON.stringify({ success: true, uploaded: 0, remaining: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let uploaded = 0;
      for (const row of rows as any[]) {
        // Try to get a color front image from the products API
        let styleImageUrl: string | null = null;
        
        try {
          const prodResp = await fetch(
            `${SS_BASE}/products/?styleID=${row.style_id}`,
            { headers: { Authorization: authHeader, Accept: "application/json" } }
          );

          if (prodResp.ok) {
            const products = await prodResp.json();
            if (Array.isArray(products) && products.length > 0) {
              // Find first product with a front image
              for (const p of products) {
                const frontImg = p.colorFrontImage || p.ColorFrontImage;
                if (frontImg) {
                  styleImageUrl = await downloadAndUploadImage(
                    supabase, authHeader, frontImg, `styles/${row.style_id}`
                  );
                  if (styleImageUrl) break;
                }
              }
            }
          }
        } catch (e) {
          console.warn(`Failed to fetch products for image backfill ${row.style_id}:`, e);
        }

        // Fallback: try style image path
        if (!styleImageUrl) {
          styleImageUrl = await downloadAndUploadImage(
            supabase, authHeader, `Images/Style/${row.style_id}_fm.jpg`, `styles/${row.style_id}`
          );
        }

        if (styleImageUrl) {
          await supabase.from("ss_catalog_cache").update({ style_image_url: styleImageUrl }).eq("style_id", row.style_id);
          uploaded++;
          console.log(`Backfilled image for style ${row.style_id}: ${styleImageUrl}`);
        }
        await sleep(300);
      }

      const { count } = await supabase
        .from("ss_catalog_cache")
        .select("style_id", { count: "exact", head: true })
        .is("style_image_url", null)
        .gt("total_skus", 0);

      return new Response(
        JSON.stringify({ success: true, uploaded, remaining: count || 0 }),
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

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function downloadAndUploadImage(
  supabase: any,
  authHeader: string,
  imagePath: string,
  storagePath: string
): Promise<string | null> {
  try {
    let urls: string[];
    if (imagePath.startsWith("http")) {
      // Replace any ssactivewear.com domain with cdn.ssactivewear.com
      const cdnUrl = imagePath
        .replace("www.ssactivewear.com", "cdn.ssactivewear.com")
        .replace("cdni.ssactivewear.com", "cdn.ssactivewear.com");
      urls = [cdnUrl, imagePath];
    } else {
      const cleanPath = imagePath.replace(/^\//, "");
      urls = [
        `https://cdn.ssactivewear.com/${cleanPath}`,
        `https://www.ssactivewear.com/${cleanPath}`,
      ];
    }

    let blob: Blob | null = null;
    for (const imgUrl of urls) {
      // Try with auth, following redirects
      try {
        const resp = await fetch(imgUrl, { 
          headers: { Authorization: authHeader, Accept: "image/*" },
          redirect: "follow",
        });
        console.log(`Image fetch ${imgUrl}: status=${resp.status}, type=${resp.headers.get("content-type")}, size=${resp.headers.get("content-length")}`);
        if (resp.ok) {
          const contentType = resp.headers.get("content-type") || "";
          if (contentType.includes("image")) {
            const b = await resp.blob();
            if (b.size > 500) {
              blob = b;
              break;
            }
          } else {
            // Read as array buffer to check size anyway
            const b = await resp.blob();
            if (b.size > 1000 && !contentType.includes("html") && !contentType.includes("text")) {
              blob = b;
              break;
            }
            console.log(`Skipped non-image response: ${contentType}, size=${b.size}`);
          }
        }
      } catch (e) {
        console.warn(`Fetch failed for ${imgUrl}:`, e);
      }

      // Try without auth
      try {
        const resp = await fetch(imgUrl, { 
          headers: { Accept: "image/*" },
          redirect: "follow",
        });
        if (resp.ok) {
          const b = await resp.blob();
          if (b.size > 500) {
            blob = b;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    if (!blob) {
      console.log(`No image downloaded for ${imagePath}`);
      return null;
    }

    const ext = blob.type?.includes("png") ? "png" : "jpg";
    const filePath = `${storagePath}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, blob, { contentType: blob.type || "image/jpeg", upsert: true });

    if (error) {
      console.warn(`Upload failed for ${filePath}:`, error.message);
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (e) {
    console.warn(`downloadAndUploadImage failed for ${imagePath}:`, e);
    return null;
  }
}
