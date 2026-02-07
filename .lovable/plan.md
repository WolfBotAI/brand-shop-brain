
# Fix Footer: Correct Categories + Working Links

## Issues to Fix

### 1. Wrong Category Assignments
| Item | Current Location | Correct Location |
|------|------------------|------------------|
| Auto-Routing | For Decorators | For Distributors |
| AI Support | For Distributors only | BOTH Decorators AND Distributors |

### 2. Broken Links
All footer links currently use `href="#"` which goes nowhere. Need to map each item to its correct route.

---

## Implementation

### Updated Services Structure with Routes

```typescript
const services = {
  "For Decorators": [
    { label: "Order Management", href: "/features/order-routing" },
    { label: "AI Vision", href: "/features/ai-vision" },
    { label: "AI Support", href: "/features/ai-support" },
    { label: "Client Portal", href: "#" },
  ],
  "For Distributors": [
    { label: "AI Store Builder", href: "/features/store-builder" },
    { label: "AI Support", href: "/features/ai-support" },
    { label: "Auto-Routing", href: "/features/order-routing" },
    { label: "Dashboard & Analytics", href: "/features/dashboard" },
  ],
  "Platform": [
    { label: "Multi-Store Management", href: "/features/dashboard" },
    { label: "AI Suggestions", href: "/features/ai-vision" },
    { label: "KPI Reports", href: "/features/dashboard" },
    { label: "Site Migration", href: "#" },
  ],
};
```

### Replace `<a href="#">` with `<Link to={...}>`

Convert all footer links to use React Router's `Link` component for proper navigation:

```tsx
{items.map((item) => (
  <li key={item.label}>
    <Link 
      to={item.href}
      className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
    >
      {item.label}
    </Link>
  </li>
))}
```

---

## Summary of Changes

| Change | Before | After |
|--------|--------|-------|
| Auto-Routing | Under Decorators | Under Distributors |
| AI Support | Distributors only | Both columns |
| Links | `href="#"` (broken) | `Link to="/features/..."` |
| Data structure | String array | Object array with label + href |

---

## File Modified

**`src/components/landing/Footer.tsx`**
- Restructure services object to include route paths
- Move Auto-Routing to Distributors column
- Add AI Support to Decorators column
- Replace all `<a href="#">` with `<Link to={route}>` for proper navigation
