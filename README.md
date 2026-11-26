# Vibe Factory

Website for **Vibe Factory**, a studio that builds vibe-coded Android apps and Progressive Web Apps.

It's plain HTML, CSS and JS, so there's no build step, and it's hosted on GitHub Pages.

## Highlights
- Black & white design with film grain, a cursor that inverts what it passes over, and a one-click colour flip
- **The Vibe Machine**: visitors type an app idea and watch a build log type itself out while a mock app appears on a phone
- The site is itself an installable PWA (manifest + service worker), so it shows the work it sells

## Deploy
1. Merge into `main`.
2. In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. The `Deploy to GitHub Pages` workflow publishes the site at `https://<user>.github.io/vibefactory/`.

## Customise
- Contact email: `CONTACT_EMAIL` at the top of `script.js`
- After changing cached files, bump `CACHE` in `sw.js` so visitors get the new version
