

# Fix: Missing Brand Logo Build Error

## Problem
The build fails because `src/assets/brand-logo.png` is imported by `Navbar.tsx` and `Footer.tsx` but the file was never copied into the project.

## Solution

### Step 1: Copy the brand logo
Copy the user's uploaded logo screenshot to `src/assets/brand-logo.png`.

### Step 2: Verify imports
Both `Navbar.tsx` and `Footer.tsx` already have `import brandLogo from "@/assets/brand-logo.png"` — no code changes needed once the file exists.

## Files to Create
| File | Action |
|------|--------|
| `src/assets/brand-logo.png` | Copy from user upload |

## Files to Modify
None — the imports are already in place.

