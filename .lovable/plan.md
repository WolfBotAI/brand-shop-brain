
# Create Dedicated Feature Pages for Platform Section

## Overview

Create 3 new feature pages for the Platform section items and update the footer links to point to them:

1. **Multi-Store Management** - Focus on managing all client stores from one place
2. **AI Suggestions** - Focus on AI recommending products to distributors/clients  
3. **KPI Reports** - Focus on best sellers, margins, per-product/store/category analytics

---

## New Pages to Create

### 1. Multi-Store Management (`/features/multi-store`)

**Purpose**: Showcase the ability to manage all client websites in one centralized dashboard

**Content**:
- Hero: "One Dashboard — Every Store"
- Interactive Demo: Visual showing multiple store cards with quick actions (settings, view, analytics)
- Feature sections:
  - Centralized Control: Manage themes, products, and pricing across all stores
  - Site Migration: Connect existing client sites or create new ones
  - Bulk Operations: Update pricing, products, or settings across multiple stores at once

---

### 2. AI Suggestions (`/features/ai-suggestions`)

**Purpose**: Highlight AI-powered product recommendations for distributors and their clients

**Content**:
- Hero: "AI That Knows — What Sells Next"
- Interactive Demo: Animated flow showing AI analyzing sales data and suggesting products
- Feature sections:
  - Smart Recommendations: AI suggests trending products based on sales patterns
  - Distributor Insights: Get suggestions on which products to recommend to clients
  - Client Upsells: AI can suggest complementary products to end customers

---

### 3. KPI Reports (`/features/kpi-reports`)

**Purpose**: Deep dive into analytics, best sellers, margins, and performance metrics

**Content**:
- Hero: "Know Your Numbers — Down to Every Detail"
- Interactive Demo: Charts showing best sellers, margin analysis, category breakdowns
- Feature sections:
  - Best Sellers: Track top-performing products across stores
  - Margin Analysis: See profitability per product, store, or category
  - Custom Reports: Filter by date range, store, category, or product type

---

## Files to Create

| File | Description |
|------|-------------|
| `src/pages/features/MultiStoreManagement.tsx` | Multi-store management page |
| `src/pages/features/AISuggestions.tsx` | AI suggestions page |
| `src/pages/features/KPIReports.tsx` | KPI reports page |
| `src/components/features/MultiStoreDemo.tsx` | Interactive demo for multi-store |
| `src/components/features/AISuggestionsDemo.tsx` | Interactive demo for AI suggestions |
| `src/components/features/KPIReportsDemo.tsx` | Interactive demo for KPI reports |

---

## Files to Modify

### `src/App.tsx`
Add 3 new routes:
- `/features/multi-store` → MultiStoreManagement
- `/features/ai-suggestions` → AISuggestions  
- `/features/kpi-reports` → KPIReports

### `src/components/landing/Footer.tsx`
Update Platform section links:
- Multi-Store Management → `/features/multi-store`
- AI Suggestions → `/features/ai-suggestions`
- KPI Reports → `/features/kpi-reports`

---

## Technical Details

### Page Structure (consistent with existing feature pages)

Each page follows this pattern:
```text
+---------------------------+
|         Navbar            |
+---------------------------+
|       FeatureHero         |
|  (icon, badge, title,     |
|   highlight, description) |
+---------------------------+
|     Interactive Demo      |
|  (animated visualization) |
+---------------------------+
|     FeatureSection 1      |
|    (3 feature cards)      |
+---------------------------+
|     FeatureSection 2      |
|    (3 feature cards)      |
+---------------------------+
|       FeatureCTA          |
+---------------------------+
|         Footer            |
+---------------------------+
```

### Interactive Demos

1. **MultiStoreDemo**: Grid of store cards with hover states, showing quick actions and status indicators

2. **AISuggestionsDemo**: Animated flow with:
   - Sales data analysis visualization
   - AI "thinking" state
   - Product recommendations appearing with confidence scores

3. **KPIReportsDemo**: Dashboard-style with:
   - Best sellers bar chart
   - Margin donut chart
   - Category breakdown table
   - Filter controls (visual only)

### Icons to Use (from lucide-react)
- Multi-Store: `LayoutGrid` or `Store`
- AI Suggestions: `Sparkles` or `Lightbulb`
- KPI Reports: `PieChart` or `FileBarChart`

---

## Summary

| Task | Action |
|------|--------|
| Create 3 new pages | MultiStoreManagement, AISuggestions, KPIReports |
| Create 3 demo components | Visual demos for each feature |
| Add routes to App.tsx | 3 new routes |
| Update Footer.tsx | Fix Platform section links |
