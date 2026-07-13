# Viper hub source

This React and Vite project generates the main `viperisuseful.cc` landing page and its shared 404 page.

## Commands

```bash
npm ci
npm run lint
npm run test -- --run
npm run build
npm run e2e
```

`npm run build` writes the production bundle into the repository root for GitHub Pages. It also removes the retired `nightly/` preview directory and emits `404.html` from the same application bundle.

Do not edit generated root files such as `index.html`, `404.html`, `hub-assets/`, `marks/`, or `media/` directly. Change the source here and rebuild.
