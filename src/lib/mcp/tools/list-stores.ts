import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_stores",
  title: "List stores",
  description: "List the signed-in distributor's storefronts with status, slug and type.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(25).describe("Maximum number of stores to return."),
    status: z.string().trim().optional().describe("Optional status filter, e.g. 'active'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, status }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let query = supabaseForUser(ctx)
      .from("stores")
      .select("id, store_name, client_name, slug, status, store_type, domain, custom_domain, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
          structuredContent: { stores: data ?? [] },
        };
  },
});
