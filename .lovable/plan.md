

# Rename "AI Conversations" → "AI Support Agent" + Rewrite Distributor Messaging

## Two changes

### 1. Global rename: "AI Conversations Agent" → "AI Support Agent"

Every file that references "AI Conversations" gets updated:

| File | What changes |
|------|-------------|
| `ConnectSection.tsx` | Hub node label: "AI Conversations" → "AI Support Agent", subtitle stays "Web · SMS · Email · FB · IG" |
| `ConnectSection.tsx` | Body copy: "AI Conversations, Voice, and Vision…" → "AI Support, Voice, and Vision…" and bullet list |
| `PackagesSection.tsx` | Feature list item + intro paragraph |
| `IntroSection.tsx` | Bullet "AI Conversations provides…" → "AI Support Agent provides…"; also remove "Package tiers: Starter (10)…" bullet and "Package B" from AI chat mockup |
| `ForDistributors.tsx` | Solution card title + "What You Get" list |
| `ForDecorators.tsx` | Solution card title |
| `PersonasSection.tsx` | Distributor summary text |
| `Assessment.tsx` | Value props for distributor and decorator results |
| `AISupport.tsx` | Already uses "AI Support Agent" in hero — no change needed |

### 2. Rewrite ForDistributors page messaging

The hero and solutions must stop being generic "package" talk and instead describe the actual platform value:

**New Hero copy:**
- Title: "Centralize Your Stores. Automate Everything Else."
- Subtitle: "AI manages your client stores, routes orders to the right suppliers and decorators, and provides 24/7 support across every channel — so you can focus on growing."

**Updated Solutions section** (5 cards → 6 cards with clearer descriptions):

1. **AI-Managed Stores** — "Centralize all client stores in one place. AI creates, updates, and manages them — or give clients access to preconfigured stores with your pricing, or let them build their own from catalogs like S&S, SanMar, and more."

2. **AI Website Assistant** — "Embedded chat on every store provides 24/7 support — tracking requests, return/refund info based on your guidelines, and product recommendations by price, brand, and material."

3. **AI Support Agent** — "Handles the same requests via text, phone, Facebook Messenger, Instagram Messenger, and email — all trained on your company, clients, brand, and goals. 24/7 omnichannel support."

4. **Intelligent Order Routing** — "Orders automatically route to the right suppliers and decorators — even splitting items from a single order across multiple vendors."

5. **Proactive Status Updates** — "Both AI agents proactively send order updates to you and your clients via the portal, dashboard, email, and text. If a decorator hasn't updated status, AI reaches out to them automatically."

6. **Certified Decorator Network** — "Vetted decorators integrated into our systems. Reviewed and certified for communication, tracking, quality, and system integration — so AI can provide real-time updates."

**Updated "What You Get" list:**
- White-labeled distributor agency account
- Agency-level reporting & analytics dashboard
- AI-managed web stores for all your clients
- AI Website Assistant + AI Support Agent for 24/7 omnichannel support
- Proactive order tracking and status updates

### Files to modify

| File | Action |
|------|-------------|
| `src/pages/personas/ForDistributors.tsx` | Rewrite hero, solutions, and "What You Get" |
| `src/components/landing/ConnectSection.tsx` | Rename label + copy |
| `src/components/landing/PackagesSection.tsx` | Rename in features + paragraph |
| `src/components/landing/IntroSection.tsx` | Rename + remove package tier bullet + fix chat mockup |
| `src/pages/personas/ForDecorators.tsx` | Rename solution card |
| `src/pages/Assessment.tsx` | Rename in value props |
| `src/components/landing/PersonasSection.tsx` | Update distributor summary |

