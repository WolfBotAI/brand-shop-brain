
# Fix ConnectSection to Show Actual Product Features

## The Problem

The current ConnectSection shows:
- Email, Chat, Social, SMS as "engagement channels"

This is **WRONG**. The product offers:
- **AI Chat Support** - Handles customer inquiries, order tracking, returns
- **AI Voice Support** - Phone calls handled by AI
- **AI Vision** - Extracts data from POs, handwritten notes, PDFs
- **Web Widget** - Deploys on any website

The graphic should show these 4 actual AI capabilities feeding into the "AI Agent" brain, NOT generic marketing channels.

---

## Current vs Correct

| Current (Wrong) | Should Be (Correct) |
|-----------------|---------------------|
| Email | AI Chat Support |
| Chat | AI Voice Support |
| Social | AI Vision (POs) |
| SMS | Web Widget |
| "engagement" | "Customer Support" |
| "Proactive engagement via Email, Chat, Social, and SMS" | "AI Chat, Voice, and Vision handle every customer interaction" |

---

## Visual Concept

```text
     [AI Chat]          [AI Voice]
     (Live Support)     (Phone Calls)
            \              /
             \            /
              [AI Agent]  ← Central Brain
             /            \
            /              \
     [AI Vision]        [Web Widget]
     (PO Extraction)    (Any Website)
```

Each node represents a real capability that the AI Agent provides:
- **AI Chat Support**: Handles tracking, returns, billing via chat
- **AI Voice Support**: Phone calls handled by AI (real-time lookups)
- **AI Vision**: Reads handwritten POs, PDFs, emails - extracts order data
- **Web Widget**: Embed on any website (Shopify, WordPress, custom)

---

## Files to Modify

### 1. `src/components/landing/ConnectSection.tsx`

Replace the current channels with the actual product features:

```typescript
const capabilities = [
  { icon: MessageSquare, label: "AI Chat", sublabel: "Live Support", position: "top-left" },
  { icon: Phone, label: "AI Voice", sublabel: "Phone Calls", position: "top-right" },
  { icon: Eye, label: "AI Vision", sublabel: "PO Extraction", position: "bottom-left" },
  { icon: Globe, label: "Web Widget", sublabel: "Any Website", position: "bottom-right" },
];
```

Update the bullet points to reflect actual support capabilities:
- "AI Chat handles order tracking, returns, and billing questions"
- "AI Voice takes phone calls with real-time order lookups"
- "AI Vision extracts data from handwritten POs and PDFs"
- "Deploy on any website - Shopify, WordPress, or custom"

### 2. Update section title and description

From: "Your Clients Get White-Glove Service. You Do Nothing."
To: Keep this, but update the description and bullets to match actual capabilities.

Update description to:
"AI Chat, Voice, and Vision handle every customer interaction. Your clients get 24/7 support — you never lift a finger."

### 3. Link "See It In Action" button to feature pages

The button should link to `/features/ai-support` where the interactive demo lives.

---

## Updated Bullet Points

Current (wrong - sounds like marketing automation):
- "Order tracking, returns, and billing updates — all automated"
- "Private catalogs with AI navigation"  
- "Proactive engagement via Email, Chat, Social, and SMS"
- "Clients feel supported 24/7, you scale without hiring"

New (correct - actual support features):
- "AI Chat answers questions, tracks orders, handles returns"
- "AI Voice takes phone calls with real-time order lookups"
- "AI Vision reads POs, PDFs, and handwritten notes automatically"
- "Deploy on any website in minutes with a single line of code"

---

## Icon Changes

| Position | Old | New |
|----------|-----|-----|
| Top Left | Mail (Email) | MessageSquare (AI Chat) |
| Top Right | MessageCircle (Chat) | Phone (AI Voice) |
| Bottom Left | Share2 (Social) | Eye (AI Vision) |
| Bottom Right | Smartphone (SMS) | Globe (Web Widget) |

---

## Summary

This changes the ConnectSection from showing generic "engagement channels" to showing the **actual AI capabilities** the platform provides:

1. **AI Chat Support** - Live customer support
2. **AI Voice Support** - Phone call handling
3. **AI Vision** - Document/PO extraction
4. **Web Widget** - Deploy anywhere

The central "AI Agent" brain connects all four capabilities, showing that one AI system powers all customer interactions.
