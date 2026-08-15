import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_catalog",
  title: "Search product catalog",
  description: "Search the Brand-Shop Catalog of blank apparel by title, brand or category.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Search text matched against product title and brand."),
    category: z.string().trim().optional().describe("Optional base category filter."),
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum number of products to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const escaped = query.replace(/[%,]/g, " ").trim();
    let request = supabaseForUser(ctx)
      .from("ss_catalog_cache")
      .select("style_id, title, brand_name, base_category, style_image_url, pricing, total_skus")
      .or(`title.ilike.%${escaped}%,brand_name.ilike.%${escaped}%`)
      .limit(limit ?? 20);
    if (category) request = request.eq("base_category", category);
    const { data, error } = await request;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
          structuredContent: { products: data ?? [] },
        };
  },
});
