import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_orders",
  title: "List orders",
  description: "List orders across the signed-in distributor's storefronts, newest first.",
  inputSchema: {
    store_id: z.string().uuid().optional().describe("Restrict to a single store id."),
    status: z.string().trim().optional().describe("Optional status filter, e.g. 'pending'."),
    limit: z.number().int().min(1).max(100).default(25).describe("Maximum number of orders to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ store_id, status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let query = supabaseForUser(ctx)
      .from("orders")
      .select("id, store_id, customer_name, customer_email, total, status, items, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (store_id) query = query.eq("store_id", store_id);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
          structuredContent: { orders: data ?? [] },
        };
  },
});
