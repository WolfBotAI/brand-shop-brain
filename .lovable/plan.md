Understood. I’ll fix this by making the 3 distributor launch options explicit in the very first homepage fold, and by removing any hard “4 questions” messaging.

1) Above-the-fold messaging (must appear at start of website)
- File: `src/components/landing/Hero.tsx`
- Update hero copy to immediately state distributors have 3 options:
  1. AI-generated store
  2. Distributor-curated store (you select products/theme for the client)
  3. Client self-build (client selects theme/products within your rules)
- Add a prominent “Choose your launch path” visual block directly in hero content (before/near CTAs), so this is unavoidable at first glance.

2) Remove fixed question-count claims
- File: `src/components/landing/IntroSection.tsx`
  - Replace “AI asks 4 discovery questions…” with adaptive wording:
    “AI asks as many discovery questions as needed to match the best products.”
  - Update paragraph copy similarly (no fixed number).
- File: `src/components/landing/IntroducingSection.tsx`
  - Replace “4-step discovery…” with “adaptive discovery” language.

3) Reinforce same model on Store Builder feature page
- File: `src/pages/features/StoreBuilder.tsx`
- Adjust top hero description so it explicitly repeats the same 3 options right away (not only later in the page).

4) Consistency sweep
- Run content search and remove/replace any remaining hard-coded “4-step / asks 4 questions” claims in marketing pages.
- Keep example chat flows (4+ messages) as examples, but no text should imply a fixed question count.

5) Validation checklist
- First viewport on homepage clearly communicates the 3 distributor options.
- Messaging now says question count is variable and goal-driven (best product match).
- No conflicting “4-step discovery” claims remain in landing/feature marketing copy.