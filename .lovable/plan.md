
# Update Footer to Target Distributors & Decorators

## Changes Required

### 1. Remove "Ecommerce Sellers" Column
The current column lists "Schools, Churches, B2B Brands, B2C Brands" which incorrectly implies we're targeting those businesses directly. We're targeting **distributors and decorators** who serve those clients.

### 2. Remove "Powered by WolfBot.AI"
Delete the entire "Powered by" section (lines 25-28).

### 3. Restructure Footer Columns
Replace the three service columns with distributor/decorator-focused categories:

| Current (Wrong) | New (Correct) |
|-----------------|---------------|
| Ecommerce Sellers: Schools, Churches, B2B, B2C | **REMOVE** |
| Decorators: Order Management, Auto-Routing, Client Portal | **For Decorators**: Order Management, AI Vision, Auto-Routing, Client Portal |
| Selling Platforms: AI Store Builder, AI Support, Pricing Controls | **For Distributors**: AI Store Builder, AI Support, Dashboard & Analytics, Pricing Controls |

### 4. Add New Column: Platform Features
Add a column highlighting cross-platform capabilities:
- **Platform**: Multi-Store Management, AI Suggestions, KPI Reports, Site Migration

### 5. Update Brand Description
Current: "bridge the gap between decorators and sellers"
New: "The all-in-one platform for distributors and decorators to manage client stores, automate support, and grow with AI-powered insights."

---

## File to Modify

**`src/components/landing/Footer.tsx`**

Updated services object:
```typescript
const services = {
  "For Decorators": ["Order Management", "AI Vision", "Auto-Routing", "Client Portal"],
  "For Distributors": ["AI Store Builder", "AI Support", "Dashboard & Analytics", "Pricing Controls"],
  "Platform": ["Multi-Store Management", "AI Suggestions", "KPI Reports", "Site Migration"],
};
```

Remove lines 25-28 (Powered by WolfBot section).

Update description to focus on distributors managing all their client websites in one place with analytics and AI suggestions.

---

## Summary

| Element | Action |
|---------|--------|
| "Ecommerce Sellers" column | Remove entirely |
| "Powered by WolfBot.AI" | Remove entirely |
| Column categories | Rename to "For Decorators", "For Distributors", "Platform" |
| Brand description | Focus on all-in-one platform for distributors/decorators |
| Add new items | AI Suggestions, KPI Reports, Site Migration, Multi-Store Management |
