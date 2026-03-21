import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SS_BASE = "https://api.ssactivewear.com/v2";
const BATCH_SIZE = 5;
const DELAY_MS = 500;

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
    const maxPages = parseInt(url.searchParams.get("maxPages") || "50");
    const perPage = 100;
    let totalSynced = 0;
    let totalImages = 0;

    // Fetch all styles paginated
    for (let page = 1; page <= maxPages; page++) {
      console.log(`Fetching styles page ${page}...`);
      const ssResp = await fetch(
        `${SS_BASE}/styles/?page=${page}&perPage=${perPage}`,
        { headers: { Authorization: authHeader, Accept: "application/json" } }
      );

      if (!ssResp.ok) {
        console.error(`SS API error on page ${page}: ${ssResp.status}`);
        break;
      }

      const styles = await ssResp.json();
      if (!Array.isArray(styles) || styles.length === 0) {
        console.log(`No more styles at page ${page}, done.`);
        break;
      }

      // Process in batches
      for (let i = 0; i < styles.length; i += BATCH_SIZE) {
        const batch = styles.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (style: any) => {
          const styleID = style.styleID ?? style.StyleID ?? 0;
          if (!styleID) return;

          const title = style.title ?? style.Title ?? "";
          const brandName = style.brandName ?? style.BrandName ?? "";
          const baseCategory = style.baseCategory ?? style.BaseCategory ?? "";
          const description = style.description ?? style.Description ?? "";
          const rawImage = style.styleImage ?? style.StyleImage ?? null;

          // Download and upload style image
          let styleImageUrl: string | null = null;
          if (rawImage) {
            styleImageUrl = await downloadAndUploadImage(
              supabase, authHeader, rawImage, `styles/${styleID}`
            );
            if (styleImageUrl) totalImages++;
          }

          // Fetch product details for colors/sizes/pricing
          let colors: any[] = [];
          let sizes: string[] = [];
          let pricing: any = {};
          let totalSkus = 0;

          try {
            const prodResp = await fetch(
              `${SS_BASE}/products/?styleID=${styleID}`,
              { headers: { Authorization: authHeader, Accept: "application/json" } }
            );

            if (prodResp.ok) {
              const products = await prodResp.json();
              if (Array.isArray(products) && products.length > 0) {
                totalSkus = products.length;
                
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
                    // Download color image
                    let colorImageUrl: string | null = null;
                    if (frontImg) {
                      colorImageUrl = await downloadAndUploadImage(
                        supabase, authHeader, frontImg, `colors/${styleID}/${colorName.replace(/[^a-zA-Z0-9]/g, "_")}`
                      );
                      if (colorImageUrl) totalImages++;
                    }

                    let colorBackImageUrl: string | null = null;
                    if (backImg) {
                      colorBackImageUrl = await downloadAndUploadImage(
                        supabase, authHeader, backImg, `colors/${styleID}/${colorName.replace(/[^a-zA-Z0-9]/g, "_")}_back`
                      );
                      if (colorBackImageUrl) totalImages++;
                    }

                    colorMap.set(colorName, {
                      name: colorName,
                      hex: `#${hex.replace(/^#/, "")}`,
                      imageUrl: colorImageUrl,
                      backImageUrl: colorBackImageUrl,
                    });
                  }
                  if (sizeName) sizeSet.add(sizeName);
                  if (custPrice > 0) {
                    minCust = Math.min(minCust, custPrice);
                    maxCust = Math.max(maxCust, custPrice);
                  }
                  if (piecePrice > 0) {
                    minPiece = Math.min(minPiece, piecePrice);
                    maxPiece = Math.max(maxPiece, piecePrice);
                  }
                }

                colors = Array.from(colorMap.values());
                sizes = Array.from(sizeSet);
                pricing = {
                  customerPrice: { min: minCust === Infinity ? 0 : minCust, max: maxCust },
                  piecePrice: { min: minPiece === Infinity ? 0 : minPiece, max: maxPiece },
                };
              }
            }
          } catch (e) {
            console.warn(`Failed to fetch products for style ${styleID}:`, e);
          }

          // Upsert into cache table
          const { error } = await supabase
            .from("ss_catalog_cache")
            .upsert({
              style_id: styleID,
              title,
              brand_name: brandName,
              base_category: baseCategory,
              description,
              style_image_url: styleImageUrl,
              colors,
              sizes,
              pricing,
              total_skus: totalSkus,
              raw_categories: baseCategory,
              updated_at: new Date().toISOString(),
            }, { onConflict: "style_id" });

          if (error) {
            console.error(`Failed to upsert style ${styleID}:`, error);
          } else {
            totalSynced++;
          }
        }));

        await sleep(DELAY_MS);
      }

      // If fewer results than perPage, we've reached the end
      if (styles.length < perPage) {
        console.log(`Last page reached (${styles.length} < ${perPage})`);
        break;
      }
    }

    return new Response(
      JSON.stringify({ success: true, totalSynced, totalImages }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("sync-catalog error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function downloadAndUploadImage(
  supabase: any,
  authHeader: string,
  imagePath: string,
  storagePath: string
): Promise<string | null> {
  try {
    // Build full URL
    let fullUrl = imagePath;
    if (!imagePath.startsWith("http")) {
      fullUrl = `https://www.ssactivewear.com/${imagePath.replace(/^\//, "")}`;
    }

    // Download with auth
    const resp = await fetch(fullUrl, {
      headers: { Authorization: authHeader, Accept: "image/*" },
    });

    if (!resp.ok) {
      // Try CDN without auth
      const cdnUrl = fullUrl.replace("www.ssactivewear.com", "cdni.ssactivewear.com");
      const cdnResp = await fetch(cdnUrl, { headers: { Accept: "image/*" } });
      if (!cdnResp.ok) return null;
      
      const blob = await cdnResp.blob();
      return await uploadBlob(supabase, blob, storagePath);
    }

    const blob = await resp.blob();
    return await uploadBlob(supabase, blob, storagePath);
  } catch (e) {
    console.warn(`Image download failed for ${imagePath}:`, e);
    return null;
  }
}

async function uploadBlob(
  supabase: any,
  blob: Blob,
  storagePath: string
): Promise<string | null> {
  const ext = blob.type?.includes("png") ? "png" : "jpg";
  const filePath = `${storagePath}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.warn(`Upload failed for ${filePath}:`, error);
    return null;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data?.publicUrl || null;
}
