

# Overhaul Catalog Step — AI Chat, Pricing, Browsing, Product Details & Logo Upload

## Problems Identified
1. **Broken images** — all mock products have `styleImage: null`, showing "No image" placeholders
2. **AI chat feels static** — single message appears instantly with no typing animation or conversational flow; page refreshes break continuity
3. **Pricing model wrong** — showing hardcoded "Distributor" and "Standard" prices instead of using Brand-Shop admin pricing rules from Codex
4. **No catalog browsing** — users can't view more suggestions, browse full catalog, filter by category, or load more items
5. **No color/size selection** — products are style-level only with no variant picking
6. **Missing logo upload + mockup step** — no way to upload a logo and auto-generate branded mockups

## Plan

### 1. Fix Product Images
- Add placeholder product images to mock data using free stock apparel images (Unsplash URLs or inline SVG illustrations per category)
- Each mock item gets a real `styleImage` URL so the grid looks polished until Codex endpoints are wired

### 2. Make AI Chat Conversational & Obvious
- Add a **typing indicator** (animated dots) before bot responses appear (1-1.5s delay)
- On entering catalog phase, show a **multi-step intro sequence**: greeting → "analyzing your vertical" → "here are my top picks" with staggered delays
- Add **quick-reply suggestion chips** below the chat (e.g., "Under $20", "Add more hoodies", "Show full catalog", "Remove caps") so users see it's interactive
- Style the chat area with a subtle gradient background and pulsing Sparkles icon to draw attention
- Make bot messages render with a character-by-character or word-by-word reveal animation

### 3. Fix Pricing Model
- Remove hardcoded "Distributor" / "Standard" labels
- Show a single **"Your Cost"** price that represents the price Brand-Shop (super admin) has set via pricing rules on the rules page
- Add a **"Retail Price"** that is the distributor's sell price (Your Cost + distributor markup)
- For now (mock data), show `customerPrice` as "Your Cost" and `piecePrice` as "Suggested Retail"
- Add a note: "Pricing set by Brand-Shop. Adjust your markup in Store Settings after creation."
- When Codex endpoints are live, these will pull from the admin pricing rules API

### 4. Add Catalog Browsing & Filtering
- Add a **"Browse Full Catalog"** button that loads all mock items (not just vertical-filtered ones)
- Add **category filter chips** at the top of the grid (T-Shirts, Hoodies, Caps, etc.) — click to filter
- Add a **"Load More Suggestions"** button per category or globally
- Add a **search input** in the catalog section so users can search by keyword

### 5. Add Color & Size Selection
- When a user clicks a product card, open a **product detail drawer/modal** showing:
  - Larger product image
  - Available colors as swatches (mock: 3-5 colors per product)
  - Available sizes as selectable chips (S, M, L, XL, 2XL)
  - Quantity input (optional for onboarding, can default to "all sizes")
  - "Add to Store" / "Remove from Store" button
- Add color/size mock data to the `SSStyle` type (`availableColors`, `availableSizes`)

### 6. Add Logo Upload Step (Phase B.5 or Phase C addition)
- After catalog selection, before or during theme selection, add a **"Upload Your Logo"** section
- File upload area (drag & drop or click) accepting PNG/SVG/AI
- On upload, show a **mockup preview** — composite the logo onto 2-3 selected products (simple CSS overlay for now)
- Display message: "Your logo will be applied to all selected products. AI will generate full mockups after store creation."
- This sets up the integration with GHL and the Codex mockup engine

## Files to Change

| File | Change |
|------|--------|
| `src/lib/api/ssProducts.ts` | Add image URLs, color/size arrays to mock data; add `getAllStyles()` and `getStyleById()` functions |
| `src/components/app/onboarding/CreateStoreStep.tsx` | Major rewrite of catalog phase: typing indicator, suggestion chips, category filters, search, browse all, product detail modal, logo upload section, pricing label fixes |
| New: `src/components/app/onboarding/ProductDetailModal.tsx` | Product detail modal with color swatches, size chips, and add/remove |
| New: `src/components/app/onboarding/LogoUploadStep.tsx` | Logo upload with drag-drop and mockup preview overlay |

## Architecture

```text
CreateStoreStep
 ├── Phase A: Details (unchanged)
 ├── Phase B: Catalog
 │    ├── AI Chat (typing indicator + suggestion chips + word reveal)
 │    ├── Category Filters + Search
 │    ├── Product Grid (with images, correct pricing)
 │    ├── "Browse Full Catalog" / "Load More"
 │    └── ProductDetailModal (colors, sizes, add/remove)
 ├── Phase B.5: Logo Upload + Mockup Preview (NEW)
 ├── Phase C: Theme (unchanged)
 └── Phase D: Payment (unchanged)
```

