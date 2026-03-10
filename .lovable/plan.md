

# Redesign the "White-Glove Service" Hub Diagram

## Problem
The current diagram uses 4 circles in corners of a 320x320 box with dashed lines to a center hub. Issues:
- AI Agent circle isn't visually centered (it is positioned correctly but the 4 corner nodes crowd it)
- Only 4 nodes — doesn't show all the individual channels (Web Chat, SMS, Email, Facebook, Instagram, Phone, PO/PDF, Web Widget)
- Doesn't convey the "one brain" concept
- Lines cross awkwardly, feels cramped

## New Design — `src/components/landing/ConnectSection.tsx`

Replace the 4-corner layout with a **true radial hub** with 7 channel nodes evenly spaced around a larger, more prominent center:

### Center Hub (larger, more prominent)
- Larger circle (w-28 h-28) with pulsing ring animation to convey "one brain"
- Label: "One Brain" with Bot icon
- Subtle outer glow ring that pulses

### 7 Satellite Nodes (evenly distributed around a 360-degree circle)
Each node represents a specific channel, placed using trigonometry for even spacing:
1. **Web Chat** (MessageSquare)
2. **SMS** (Smartphone)
3. **Email** (Mail)
4. **Facebook** (MessageCircle)
5. **Instagram** (Instagram icon or Camera)
6. **Phone Calls** (Phone)
7. **PO Vision** (Eye)

### Connections
- Animated dashed lines from each satellite to center
- Lines animate in sequentially for a "connecting" effect
- All lines originate from center = "one brain" visual

### Layout
- Increase container from w-80 h-80 to w-96 h-96 (or responsive)
- Satellites positioned using `Math.cos`/`Math.sin` at equal angular intervals
- Each satellite: small circle (w-14 h-14) with icon + label below

### Animation
- Center hub scales in first
- Pulse ring animates continuously
- Lines draw from center outward
- Satellites pop in sequentially around the circle

No changes to the right-side content (headline, bullet points, CTA). Only the left visual is rebuilt.

