

# Calm Down the "Three Ways" Section

## Problem
Each of the 3 cards has its own independent auto-advancing timer (every 3s), progress bar, scale animations, and an AnimatePresence preview area — all running simultaneously. With 3 cards cycling independently, the section feels chaotic and impossible to read.

## Solution: Static cards with click-to-explore interaction

Remove all auto-advancing timers, progress bars, and the redundant "visual preview area." Make the cards static and scannable, with subtle interaction on click only.

**Each card will show:**
- Icon, title, subtitle, description (static, always visible)
- All 3 steps listed statically with their icons and labels — always visible, no cycling
- On hover: subtle card lift (shadow), no scale pulsing
- Clicking a step highlights it with the primary accent — no auto-advance

**What gets removed:**
- `setInterval` auto-advance timer
- `Progress` bar component
- `AnimatePresence` preview area at the bottom (redundant — it duplicates the step info)
- `motion.button` scale animation on active step
- `isPaused` / `onMouseEnter` / `onMouseLeave` pause logic

**What stays:**
- Fade-in on scroll (once) for each card with staggered delay
- Step icons with active/complete color states (but only on user click, not auto)
- Clean card layout: header + static step list

## File Changed
`src/components/landing/ThreeWaysSection.tsx` — simplify `PathDemo` to a static card with clickable steps, remove all timer/progress/AnimatePresence logic.

