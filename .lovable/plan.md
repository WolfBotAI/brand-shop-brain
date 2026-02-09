

# Site Migration Feature Page + Supplier Integrations

## Overview

Create a dedicated Site Migration feature page for the Platform section and add industry-specific supplier integrations (SanMar, AlphaBroder, S&S Activewear) to highlight the platform's connectivity with apparel distributors.

---

## Part 1: Site Migration Feature Page

### Route
`/features/site-migration`

### Page Content

**Hero Section**:
- Title: "Migrate Your Sites —" highlight: "Without the Headache"
- Badge: "Site Migration"
- Icon: `ArrowRightLeft` or `Upload`
- Description: "Bring your existing client stores to Brand-Shop.AI with our guided migration tools. We handle the complexity so you can focus on growing."

**Interactive Demo**: Visual migration flow showing:
- Source platform selection (InkSoft, custom site, etc.)
- Data import progress (products, customers, orders)
- Validation checklist
- Go-live confirmation

**Feature Section 1 - "Seamless Data Transfer"**:
| Feature | Description |
|---------|-------------|
| Product Import | Bulk import products with images, pricing, and variants intact |
| Customer Migration | Transfer customer accounts, order history, and preferences |
| Order History | Keep historical order data for reporting and reordering |

**Feature Section 2 - "Zero Downtime Migration"**:
| Feature | Description |
|---------|-------------|
| Parallel Running | Test the new store while the old one stays live |
| DNS Cutover | One-click domain switching when you're ready |
| Rollback Safety | Instant rollback if anything goes wrong |

---

## Part 2: Supplier Integrations

Add 4 new integrations to the Integrations component focused on apparel suppliers:

| Supplier | Category | Description |
|----------|----------|-------------|
| **SanMar** | Supplier | Real-time inventory and pricing from SanMar catalog |
| **AlphaBroder** | Supplier | Access AlphaBroder's full product catalog |
| **S&S Activewear** | Supplier | Sync S&S Activewear inventory and products |
| **Augusta Sportswear** | Supplier | Sports and team apparel integration |

This expands the grid from 8 to 12 integrations (3x4 layout remains visually balanced).

---

## Files to Create

| File | Description |
|------|-------------|
| `src/pages/features/SiteMigration.tsx` | Site Migration feature page |
| `src/components/features/SiteMigrationDemo.tsx` | Interactive migration flow demo |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add route `/features/site-migration` |
| `src/components/landing/Footer.tsx` | Update Site Migration link from `#` to `/features/site-migration` |
| `src/components/landing/Integrations.tsx` | Add SanMar, AlphaBroder, S&S Activewear, Augusta Sportswear |

---

## Technical Details

### SiteMigrationDemo Component

Visual stepped flow showing:
```text
+------------------+     +------------------+     +------------------+
|  Select Source   | --> |  Import Data     | --> |  Validate & Go   |
|  - InkSoft       |     |  - Products      |     |  - Test store    |
|  - Custom Site   |     |  - Customers     |     |  - DNS switch    |
|  - Spreadsheet   |     |  - Orders        |     |  - Go Live!      |
+------------------+     +------------------+     +------------------+
```

Animated progress bars showing import status with checkmarks for completed steps.

### Updated Integrations Array

```typescript
const integrations = [
  // Existing 8 integrations...
  
  // New supplier integrations
  {
    name: "SanMar",
    category: "Supplier",
    description: "Real-time inventory and pricing sync",
  },
  {
    name: "AlphaBroder",
    category: "Supplier", 
    description: "Full product catalog access",
  },
  {
    name: "S&S Activewear",
    category: "Supplier",
    description: "Inventory and product sync",
  },
  {
    name: "Augusta",
    category: "Supplier",
    description: "Sports and team apparel integration",
  },
];
```

### Footer Update

```typescript
"Platform": [
  { label: "Multi-Store Management", href: "/features/multi-store" },
  { label: "AI Suggestions", href: "/features/ai-suggestions" },
  { label: "KPI Reports", href: "/features/kpi-reports" },
  { label: "Site Migration", href: "/features/site-migration" },  // Updated
],
```

---

## Summary

| Task | Action |
|------|--------|
| Create SiteMigration.tsx | New feature page with hero, demo, and feature sections |
| Create SiteMigrationDemo.tsx | Animated migration flow visualization |
| Add route to App.tsx | `/features/site-migration` |
| Fix Footer link | Update `#` to `/features/site-migration` |
| Add 4 supplier integrations | SanMar, AlphaBroder, S&S Activewear, Augusta Sportswear |

