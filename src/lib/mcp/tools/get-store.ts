import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_store",
  title: "Get store details",
  description: "Fetch full configuration for one storefront by id or slug.",
  inputSchema: {
    store_id: z.string().uuid().optional().describe("Store id (uuid)."),
    slug: z.string().trim().min(1).optional().describe("Store slug, used when no id is given."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ store_id, slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    if (!store_id && !slug) return { content: [{ type: "text", text: "Provide store_id or slug" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let query = supabase.from("stores").select("*").limit(1);
    query = store_id ? query.eq("id", store_id) : query.eq("slug", slug!);
    const { data, error } = await query.maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Store not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { store: data },
    };
  },
});
