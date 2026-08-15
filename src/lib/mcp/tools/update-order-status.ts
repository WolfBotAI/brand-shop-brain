import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_order_status",
  title: "Update order status",
  description: "Set the status of one order belonging to the signed-in distributor.",
  inputSchema: {
    order_id: z.string().uuid().describe("Order id (uuid)."),
    status: z
      .string()
      .trim()
      .min(1)
      .describe("New status value, e.g. 'pending', 'in_production', 'shipped', 'delivered', 'cancelled'."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_id, status }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("orders")
      .update({ status })
      .eq("id", order_id)
      .select("id, status, store_id, customer_name, total")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Order not found or not accessible" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { order: data },
    };
  },
});
