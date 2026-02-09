

# Homepage & Navigation Improvements Plan

## Issues Identified

### 1. Irrelevant Inline Images on Homepage
The following Unsplash stock photos are not relevant to apparel distributors/decorators:

| Location | Current Image | Problem |
|----------|---------------|---------|
| Hero background | `photo-1556761175-4b46a572b786` | Generic office meeting, not apparel-related |
| IntroSection | `photo-1556761175-5973dc0f32e7` | Office collaboration, not relevant |
| IntroducingSection | `photo-1441986300917-64674bd600d8` | Generic retail store, not branded apparel |

**Solution**: Replace with apparel/print shop relevant imagery or remove entirely and rely on the UI mockups already present.

---

### 2. CTA Button Font Visibility Issues
The outline buttons have poor contrast making text hard to read:

**Hero.tsx (line 57-63)**:
```tsx
<Button variant="outline" className="px-8 py-6 text-lg rounded-full">
```
- Uses default outline variant which may have low contrast

**CTASection.tsx (line 66-70)**:
```tsx
<Button variant="outline" 
  className="border-[hsl(var(--section-dark-foreground))]/30 text-[hsl(var(--section-dark-foreground))]"
>
```
- Text uses 30% opacity border which is very faint
- Section uses `--section-dark` (dark navy #1A1A2E) background

**FeatureCTA.tsx (line 35-39)**:
```tsx
<Button variant="outline"
  className="border-secondary-foreground/30 text-secondary-foreground"
>
```
- Similar issue with low opacity borders on dark backgrounds

**Solution**: Increase border opacity and ensure text uses full color contrast.

---

### 3. Navbar Not Always Visible/Sticky
The navbar IS already position fixed (`fixed top-0 left-0 right-0 z-50`), but when not scrolled, it uses `bg-transparent`, making it invisible against certain section backgrounds.

**Current behavior** (Navbar.tsx lines 33-37):
```tsx
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isScrolled 
    ? "bg-background/95 backdrop-blur-sm shadow-md" 
    : "bg-transparent"
}`}
```

**Solution**: Always apply a visible background (with blur/transparency for elegance) regardless of scroll position.

---

### 4. Integration API Verification

| Brand | Has Public API? | Documentation |
|-------|-----------------|---------------|
| **Printavo** | YES | GraphQL API v2.0 at printavo.com/docs/api/v2 |
| **DecoNetwork** | YES | Order Management API, Purchase Order API, Product API, Inventory API (Enterprise plans) |
| **InkSoft** | YES | API2 with GitHub samples at github.com/InkSoft/api |
| **GraphicsFlow** | UNCLEAR | No public developer API found - appears to be a product by InkSoft with design tools, not an open API |
| **ShopWorks** | YES | Custom integrations via PromoLink, shopping cart integrations, payment processing |
| **TaxJar** | YES | Well-documented tax API |
| **QuickBooks** | YES | Extensive Intuit developer platform |

**Recommendation**: Remove or reword GraphicsFlow entry since it doesn't appear to have a public integration API. All others are confirmed valid.

---

### 5. Highlight Integration Capabilities

The Integrations component exists (`src/components/landing/Integrations.tsx`) but is **NOT imported on the homepage** (`src/pages/Index.tsx`).

**Solution**: 
- Add Integrations section to the homepage
- Update messaging to emphasize "integrates into almost any system"
- Add prominent "API Access" messaging

---

## Files to Modify

### 1. `src/components/landing/Navbar.tsx`
- Always show background (semi-transparent with blur) regardless of scroll state
- Remove the `bg-transparent` condition for unscrolled state

### 2. `src/components/landing/Hero.tsx`
- Replace irrelevant stock photo with apparel-relevant imagery
- Fix outline button contrast

### 3. `src/components/landing/IntroSection.tsx`
- Replace stock photo with relevant apparel/print shop imagery

### 4. `src/components/landing/IntroducingSection.tsx`
- Replace generic retail image with branded merchandise/apparel display imagery

### 5. `src/components/landing/CTASection.tsx`
- Fix outline button border/text contrast
- Remove "Powered by WolfBot.AI Intelligence" text (per brand memory)

### 6. `src/components/features/FeatureCTA.tsx`
- Fix outline button contrast on dark secondary background

### 7. `src/components/landing/Integrations.tsx`
- Remove or update GraphicsFlow entry (no confirmed public API)
- Strengthen "integrates with any system" messaging

### 8. `src/pages/Index.tsx`
- Import and add Integrations section to homepage

---

## Technical Implementation Details

### Navbar Fix
Change from conditional background to always-visible:
```tsx
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
  bg-background/90 backdrop-blur-sm ${
  isScrolled ? "shadow-md" : ""
}`}
```

### Button Contrast Fix
Update outline buttons on dark backgrounds:
```tsx
// Before
className="border-[hsl(var(--section-dark-foreground))]/30 text-[hsl(var(--section-dark-foreground))]"

// After
className="border-white/50 text-white hover:bg-white/10"
```

### Recommended Replacement Images
Use Unsplash images relevant to apparel/print industry:
- Screen printing process
- Embroidered apparel
- Branded merchandise displays
- Print shop environments

Example searches:
- "screen printing tshirt"
- "embroidery machine"  
- "branded merchandise corporate"
- "custom apparel production"

### Homepage Integration Section
Add between ConnectSection and CTASection:
```tsx
import { Integrations } from "@/components/landing/Integrations";

// In component:
<ConnectSection />
<Integrations />
<CTASection />
```

---

## Summary

| Issue | Fix |
|-------|-----|
| Irrelevant images | Replace 3 stock photos with apparel industry imagery |
| CTA button visibility | Increase border opacity, ensure full text contrast |
| Navbar not always visible | Always apply semi-transparent background with blur |
| Integration verification | GraphicsFlow lacks public API - remove or reword |
| Integration visibility | Add Integrations section to homepage |
| WolfBot branding | Remove "Powered by WolfBot.AI" from CTASection |

