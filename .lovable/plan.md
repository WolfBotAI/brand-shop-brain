

# Fix: Copy Brand Logo to Resolve Build Error

## Problem
The build fails because `src/assets/brand-logo.png` does not exist. Both `Navbar.tsx` and `Footer.tsx` import this file.

## Solution

### Step 1: Copy the uploaded logo to the project
Copy the previously uploaded brand logo image (`user-uploads://Screenshot_2026-02-24_at_10.01.55 AM.png`) to `src/assets/brand-logo.png`.

### Step 2: No other changes needed
The imports in `Navbar.tsx` and `Footer.tsx` already reference this path correctly. Once the file exists, the build will succeed and the logo will appear in both the navbar and footer.

## Files to Create
| File | Action |
|------|--------|
| `src/assets/brand-logo.png` | Copy from user's uploaded screenshot |

## Files to Modify
None.

