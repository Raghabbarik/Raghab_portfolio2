# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

# Raghab_portfolio2

## Favicon & Hero Image

To set the hero section image that also appears as the site tab icon (favicon):

1. Place your chosen image files in the `public/` directory. For example:
   - `public/hero.jpg` (used by the hero component via `about.profileImageUrl` or manually)
   - `public/favicon.ico` (browser tab icon)
   - Optionally `public/apple-touch-icon.png` for iOS homescreen bookmarks.

2. The layout metadata now includes an `icons` section—Next.js will automatically
   include `<link>` tags for you, but you may also manually add additional
   references inside `<head>` if needed.

3. If you want the same image for both hero and favicon, simply copy/convert the
   hero asset to `favicon.ico` in `public/` and update the `about.profileImageUrl`
   value through the data context (or admin panel).

4. Restart the development server (`npm run dev`) to see changes.

---
