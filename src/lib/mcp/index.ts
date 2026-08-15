import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listStoresTool from "./tools/list-stores";
import getStoreTool from "./tools/get-store";
import listOrdersTool from "./tools/list-orders";
import updateOrderStatusTool from "./tools/update-order-status";
import searchCatalogTool from "./tools/search-catalog";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "brand-shop-ai",
  title: "Brand-Shop AI",
  version: "0.1.0",
  instructions:
    "Tools for Brand-Shop AI. Use `list_stores` and `get_store` to inspect the signed-in distributor's storefronts, `list_orders` and `update_order_status` to manage orders, and `search_catalog` to look up blank apparel products.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listStoresTool, getStoreTool, listOrdersTool, updateOrderStatusTool, searchCatalogTool],
});
