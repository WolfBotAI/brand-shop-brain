

# Printful Integration + Unified Shipping + Multi-Source Order Tracking

## What This Adds to the Current Plan

Two critical features that tie the fulfillment pipeline together:

### 1. Unified Shipping Quotation for Split Orders

**Problem:** When an order splits across two decorators (or Printful + a decorator), the customer sees two separate shipping charges. We need to calculate all shipping costs behind the scenes and present ONE unified shipping price.

**How it works:**

```text
Customer cart at checkout
  │
  ├─ Items routed to Decorator A (via S&S)
  │   └─ Get shipping quote from ShipStation API
  │       (S&S → Decorator A → Customer)
  │
  ├─ Items routed to Decorator B (via S&S)  
  │   └─ Get shipping quote from ShipStation API
  │       (S&S → Decorator B → Customer)
  │
  └─ Items routed to Printful
      └─ Get shipping quote from Printful API
          (Printful → Customer, built-in)
  │
  COMBINE ALL QUOTES → Display single "Shipping: $XX.XX" to customer
```

**Shipping solution recommendation: ShipStation** for all non-Printful items.
- ShipStation supports FedEx, UPS, USPS, DHL in one API
- Provides real-time rate quotes via `POST /shipments/getrates`
- Handles label creation and tracking
- Distributors can connect their own ShipStation account or use the platform default
- Printful handles its own shipping natively — no external shipping needed for those items

**Implementation:**
- Store `SHIPSTATION_API_KEY` and `SHIPSTATION_API_SECRET` as secrets
- New edge function `quote-shipping` that:
  - Accepts cart items + shipping address
  - Splits items by fulfillment destination (using routing rules)
  - Calls ShipStation rates API for each non-Printful shipment leg
  - Calls Printful shipping rates API for Printful items
  - Sums all quotes into one unified price
  - Returns the combined shipping cost + breakdown (hidden from customer, visible to distributor)
- Update `PublicStorefront.tsx` checkout to call `quote-shipping` before payment
- Store the per-leg breakdown in `orders.shipping_details` (jsonb) for internal reference

### 2. Multi-Source Real-Time Order Status Tracking

**Problem:** The current `check-order-status` edge function only reads from the local `orders` table status field. It needs to query all fulfillment sources for real-time data.

**Status sources (checked in order, per line item):**
1. **Printful API** — `GET /orders/{id}` returns status + tracking URL + carrier info
2. **ShipStation API** — `GET /shipments?orderNumber={id}` returns tracking number + carrier + delivery status
3. **GHL custom fields** — query contact record for manual status updates (when decorator has no API)
4. **Local database** — fallback status from `orders.status` field

**How tracking works:**

```text
Customer enters Order # or Email on status page
  │
  └─ check-order-status edge function
      │
      ├─ Reads order from DB, gets fulfillment_details jsonb
      │
      ├─ For each line item group:
      │   ├─ Printful items → GET Printful API /orders/{printful_id}
      │   ├─ S&S/Decorator items → GET ShipStation /shipments/{tracking}
      │   └─ Manual items → Read GHL contact custom field via API
      │
      └─ Merge into unified timeline per item group
          └─ Return combined status to frontend
```

**Frontend changes to `CustomerOrders.tsx`:**
- Show per-item-group status when order is split (e.g., "T-Shirts: Shipped" / "Mugs: In Production")
- Display tracking numbers and carrier links when available
- Show estimated delivery dates from ShipStation/Printful

**GHL integration for manual status:**
- Add custom fields to GHL contact: `order_status`, `tracking_number`, `decorator_notes`
- The `check-order-status` function queries GHL API for these fields as fallback
- Distributors or decorators update status in GHL manually when no API exists

## Database Changes

| Table | Change |
|-------|--------|
| `orders` | Add `shipping_details` jsonb (per-leg shipping breakdown), add `fulfillment_details` jsonb (per-item source, external IDs, tracking numbers) |

## New Secrets Needed

| Secret | Purpose |
|--------|---------|
| `SHIPSTATION_API_KEY` | ShipStation API authentication |
| `SHIPSTATION_API_SECRET` | ShipStation API authentication |
| `PRINTFUL_API_KEY` | Already discussed in prior plan |

## Files to Create/Change

| File | Change |
|------|--------|
| Migration | Add `shipping_details` and `fulfillment_details` jsonb to `orders` |
| NEW: `supabase/functions/quote-shipping/index.ts` | Combines ShipStation + Printful shipping quotes into one price |
| `supabase/functions/check-order-status/index.ts` | Query Printful, ShipStation, and GHL for real-time status per line item group |
| `src/pages/app/PublicStorefront.tsx` | Call `quote-shipping` at checkout, display unified shipping price |
| `src/pages/app/CustomerOrders.tsx` | Show per-item-group status, tracking numbers, carrier links, estimated delivery |
| `supabase/functions/ghl-sync/index.ts` | Add custom field read for order status fallback |

## Implementation Order
1. Store ShipStation + Printful API keys as secrets
2. Database migration (add shipping/fulfillment jsonb columns to orders)
3. Build `quote-shipping` edge function
4. Update checkout flow to show unified shipping
5. Upgrade `check-order-status` to query Printful + ShipStation + GHL
6. Update `CustomerOrders.tsx` with per-source tracking display

