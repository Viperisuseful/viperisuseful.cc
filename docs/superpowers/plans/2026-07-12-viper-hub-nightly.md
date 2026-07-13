# Viper Hub Nightly Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a complete personal-OS hub preview at `https://viperisuseful.cc/nightly/`, then add safe redirect aliases for Turtle Cave and QuickRunLab.

**Architecture:** A self-contained Vite React TypeScript app lives in `nightly-src/` and builds committed static output to `nightly/` for the existing GitHub Pages deployment. Typed destination data feeds focused launcher, project, systems, presence, and footer components. Nginx serves two redirect-only subdomains after protected infrastructure backup and Cloudflare DNS setup.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS v4, customized shadcn/ui with Radix, Motion, Phosphor Icons, Fontsource variable fonts, Vitest, Testing Library, Playwright, axe-core, GitHub Pages, Nginx, Cloudflare DNS.

## Global Constraints

- Existing `/`, `/blog/`, `/privacy/`, social redirect pages, and app routes remain unchanged.
- Preview base path is exactly `/nightly/`; output directory is exactly `nightly/`.
- Root homepage is not promoted during this plan.
- Design follows `PRODUCT.md`, `DESIGN.md`, and `docs/superpowers/specs/2026-07-12-viper-hub-nightly-design.md`.
- UI uses one lime accent, semantic OKLCH tokens, system light/dark mode, 14px surfaces, 10px compact frames, and pill buttons.
- Display/body use Bricolage Grotesque Variable. Technical metadata uses JetBrains Mono Variable.
- Phosphor is the only UI icon family. Official project logos may retain their own marks.
- All motion honors `prefers-reduced-motion`; no global scroll listener or custom cursor.
- Visible copy contains zero em dashes and no fake metrics, fake terminal, section numbering, or generic SaaS claims.
- WCAG 2.2 AA, 44px touch targets, visible focus, and keyboard-complete navigation are required.
- Do not expose Coolify, Vaultwarden, CDN, Cloudflare, SMTP, or application credentials.
- Nginx remains the only public VM listener on ports 80 and 443. Coolify Traefik remains disabled.

---

### Task 1: Scaffold the isolated nightly application

**Files:**
- Create: `nightly-src/**`
- Modify: `package.json`
- Modify: `.gitignore`
- Test: `nightly-src/src/app.test.tsx`

**Interfaces:**
- Consumes: Existing GitHub Pages repository and `/nightly/` route requirement.
- Produces: `npm run nightly:dev`, `npm run nightly:test`, `npm run nightly:build`, and a Vite app that builds into `nightly/`.

- [ ] **Step 1: Record clean baseline**

Run:

```bash
git status --short --branch
git diff --check
curl -fsSL -o /dev/null -w '%{http_code}\n' https://viperisuseful.cc/
curl -fsSL -o /dev/null -w '%{http_code}\n' https://viperisuseful.cc/blog/
curl -fsSL -o /dev/null -w '%{http_code}\n' https://viperisuseful.cc/privacy/
```

Expected: clean tree except documented commits ahead of origin, no whitespace errors, and all three public routes return `200`.

- [ ] **Step 2: Create Vite plus shadcn project**

Run from repository root:

```bash
npx shadcn@latest init --template vite --base radix --preset nova --name nightly-src --css-variables --pointer
npx shadcn@latest info --json --cwd nightly-src
npx shadcn@latest docs button badge sheet separator tooltip skeleton
npx shadcn@latest add button badge sheet separator tooltip skeleton --cwd nightly-src --yes
```

Expected: `nightly-src/components.json` reports Vite, Tailwind v4, Radix, CSS variables, and installed source components.

- [ ] **Step 3: Add runtime and test dependencies**

Run:

```bash
npm --prefix nightly-src install motion @phosphor-icons/react @fontsource-variable/bricolage-grotesque @fontsource-variable/jetbrains-mono
npm --prefix nightly-src install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test axe-core
```

Expected: dependencies resolve without audit-level installation failure.

- [ ] **Step 4: Configure base path, build output, and tests**

Set `nightly-src/vite.config.ts` to:

```ts
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/nightly/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "../nightly", emptyOutDir: true },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
```

Create `nightly-src/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add root scripts:

```json
{
  "nightly:dev": "npm --prefix nightly-src run dev",
  "nightly:test": "npm --prefix nightly-src run test -- --run",
  "nightly:build": "npm --prefix nightly-src run build",
  "nightly:e2e": "npm --prefix nightly-src run e2e"
}
```

Keep existing `start` script and dependency intact.

- [ ] **Step 5: Write and run the first failing render test**

Create `nightly-src/src/app.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Viper hub", () => {
  it("renders the approved hub message", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /everything viper runs, in one place/i,
      }),
    ).toBeInTheDocument();
  });
});
```

Run `npm run nightly:test`.

Expected: FAIL because approved app composition does not exist yet.

- [ ] **Step 6: Commit scaffold**

```bash
git add package.json package-lock.json .gitignore nightly-src
git commit -m "build: scaffold nightly hub app"
```

### Task 2: Acquire and validate real project assets

**Files:**
- Create: `nightly-src/public/media/turtle-cave.png`
- Create: `nightly-src/public/media/quickrunlab.png`
- Create: `nightly-src/public/media/vipersearch.png`
- Create: `nightly-src/public/media/scp.png`
- Create: `nightly-src/public/marks/{viper,coolify,bitwarden,cloudflare,github,modrinth}.svg`
- Create: `nightly-src/src/data/destinations.ts`
- Test: `nightly-src/src/data/destinations.test.ts`

**Interfaces:**
- Produces: `Destination`, `publicProjects`, `privateSystems`, and `socialLinks` used by all page sections.

- [ ] **Step 1: Copy approved Turtle Cave capture and capture fresh app surfaces**

Use SCP with fixed 1600x1000 viewport and enough wait for dynamic content:

```bash
install -d nightly-src/public/media nightly-src/public/marks
cp /tmp/turtlecave-nightly.png nightly-src/public/media/turtle-cave.png
curl --fail --get 'https://scp.viperisuseful.cc/screenshot' --data-urlencode 'url=https://quickrunlab.tech' --data 'width=1600' --data 'height=1000' --data 'device_scale_factor=1' --data 'wait=8' --output nightly-src/public/media/quickrunlab.png
curl --fail --get 'https://scp.viperisuseful.cc/screenshot' --data-urlencode 'url=https://search.viperisuseful.cc' --data 'width=1600' --data 'height=1000' --data 'device_scale_factor=1' --data 'wait=4' --output nightly-src/public/media/vipersearch.png
curl --fail --get 'https://scp.viperisuseful.cc/screenshot' --data-urlencode 'url=https://scp.viperisuseful.cc' --data 'width=1600' --data 'height=1000' --data 'device_scale_factor=1' --data 'wait=4' --output nightly-src/public/media/scp.png
```

Expected: four non-trivial PNG files. Inspect each with `view_image`; recapture rather than crop if content is incomplete.

- [ ] **Step 2: Fetch verified official marks**

Download local SVGs from Simple Icons, plus reuse the local Viper mark after converting it to a web-optimized asset. Verify every response is SVG before use:

```bash
curl -fsSL https://cdn.simpleicons.org/coolify -o nightly-src/public/marks/coolify.svg
curl -fsSL https://cdn.simpleicons.org/bitwarden -o nightly-src/public/marks/bitwarden.svg
curl -fsSL https://cdn.simpleicons.org/cloudflare -o nightly-src/public/marks/cloudflare.svg
curl -fsSL https://cdn.simpleicons.org/github -o nightly-src/public/marks/github.svg
curl -fsSL https://cdn.simpleicons.org/modrinth -o nightly-src/public/marks/modrinth.svg
cp resources/badge-leaf.svg nightly-src/public/marks/viper.svg
file nightly-src/public/marks/*
```

Expected: no HTML error page, empty file, or mixed icon family.

- [ ] **Step 3: Write typed destination data**

Create `nightly-src/src/data/destinations.ts` with this public interface:

```ts
export type DestinationAccess = "public" | "login" | "informational";

export type Destination = {
  id: string;
  name: string;
  description: string;
  href?: string;
  image?: string;
  mark?: string;
  access: DestinationAccess;
  action: "Open project" | "Sign in" | "View source" | "No public link";
  tags: readonly string[];
};

export const publicProjects: readonly Destination[] = [
  {
    id: "quickrunlab",
    name: "QuickRunLab",
    description: "Run C, Python, and R in a real interactive browser terminal.",
    href: "https://quickrunlab.viperisuseful.cc",
    image: "/nightly/media/quickrunlab.png",
    access: "public",
    action: "Open project",
    tags: ["Python", "Docker", "WebSocket"],
  },
  {
    id: "turtle-cave",
    name: "Turtle Cave",
    description: "Community tools, moderation, support, and a living corner of the web.",
    href: "https://turtle.viperisuseful.cc",
    image: "/nightly/media/turtle-cave.png",
    access: "public",
    action: "Open project",
    tags: ["Node.js", "Discord", "MongoDB"],
  },
  {
    id: "vipersearch",
    name: "ViperSearch",
    description: "A private-minded metasearch engine hosted on Viper infrastructure.",
    href: "https://search.viperisuseful.cc",
    image: "/nightly/media/vipersearch.png",
    access: "public",
    action: "Open project",
    tags: ["SearXNG", "Valkey"],
  },
  {
    id: "scp",
    name: "Screenshot API",
    description: "Capture full-page websites at exact dimensions with a real browser.",
    href: "https://scp.viperisuseful.cc",
    image: "/nightly/media/scp.png",
    access: "public",
    action: "Open project",
    tags: ["FastAPI", "Playwright"],
  },
  {
    id: "vipercode",
    name: "ViperCode",
    description: "A focused Windows coding-agent desktop app with cleaner agent flow and diffs.",
    href: "https://github.com/Viperisuseful/ViperCode",
    mark: "/nightly/marks/github.svg",
    access: "public",
    action: "View source",
    tags: ["Electron", "React", "Codex"],
  },
  {
    id: "viperproxy",
    name: "ViperProxy",
    description: "Minecraft proxy routing with a fail-closed kill switch and encrypted profiles.",
    href: "https://modrinth.com/mod/viperproxy",
    mark: "/nightly/marks/modrinth.svg",
    access: "public",
    action: "Open project",
    tags: ["Java", "Fabric", "Netty"],
  },
  {
    id: "dulkirmod",
    name: "DulkirMod Port",
    description: "An active Minecraft 1.21 port built with Kotlin, Java, and Fabric.",
    access: "informational",
    action: "No public link",
    tags: ["Kotlin", "Fabric"],
  },
] as const;
```

Add exact `privateSystems` entries for Coolify, Vaultwarden, and CDN using their approved URLs, official marks, `access: "login"`, and `action: "Sign in"`. Add social links for GitHub, Discord, Modrinth, blog, email, and privacy.

- [ ] **Step 4: Test data completeness**

Create `nightly-src/src/data/destinations.test.ts` asserting:

```ts
import { describe, expect, it } from "vitest";
import { privateSystems, publicProjects } from "./destinations";

describe("destination registry", () => {
  it("uses unique ids and HTTPS links", () => {
    const all = [...publicProjects, ...privateSystems];
    expect(new Set(all.map((item) => item.id)).size).toBe(all.length);
    expect(all.filter((item) => item.href).every((item) => item.href!.startsWith("https://"))).toBe(true);
  });

  it("marks every private system as login required", () => {
    expect(privateSystems.map((item) => item.access)).toEqual(["login", "login", "login"]);
  });
});
```

Run `npm run nightly:test`. Expected: data tests pass; initial App render test still fails.

- [ ] **Step 5: Commit assets and data**

```bash
git add nightly-src/public nightly-src/src/data
git commit -m "feat: add nightly hub destinations and media"
```

### Task 3: Build theme, navigation, and hero launcher

**Files:**
- Modify: `nightly-src/src/index.css`
- Modify: `nightly-src/src/App.tsx`
- Create: `nightly-src/src/components/site-header.tsx`
- Create: `nightly-src/src/components/theme-toggle.tsx`
- Create: `nightly-src/src/components/hero-launcher.tsx`
- Create: `nightly-src/src/lib/theme.ts`
- Test: `nightly-src/src/components/theme-toggle.test.tsx`

**Interfaces:**
- Produces: semantic theme tokens, persisted theme behavior, navigation landmarks, and hero CTA anchors.

- [ ] **Step 1: Implement approved tokens and fonts**

Import both Fontsource variable families in `nightly-src/src/main.tsx`. Replace generated theme values in `index.css` with the exact `DESIGN.md` OKLCH tokens. Define `--radius: 0.875rem`, `--radius-control: 0.625rem`, focus ring, typography scale, `min-height: 100dvh`, image fallback, and reduced-motion overrides.

Do not add raw component colors, gradient text, pure black/white, wide border-plus-shadow cards, or manual overlay z-index values.

- [ ] **Step 2: Test theme persistence before implementation**

Write `theme-toggle.test.tsx` to assert the toggle has an accessible name, changes `document.documentElement.dataset.theme`, and stores `viper-theme` in local storage. Run the single test and require FAIL before implementing `theme.ts` and `ThemeToggle`.

- [ ] **Step 3: Implement theme utility and toggle**

Public interface:

```ts
export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "viper-theme";
export function getInitialTheme(): Theme;
export function applyTheme(theme: Theme): void;
```

Use Phosphor `Moon` and `Sun`, shadcn `Button` with `variant="ghost"`, and a tooltip. Use no hand-rolled SVG.

- [ ] **Step 4: Build navigation and hero**

`SiteHeader` renders mark, Projects, Systems, About, GitHub, theme toggle, and a mobile shadcn `Sheet` with `SheetTitle`. `HeroLauncher` renders the approved H1, 14-word subtext, `Explore work` anchor, GitHub action, and a real-image launcher composition.

Motion runs only inside `hero-launcher.tsx`, uses `motion/react`, and checks `useReducedMotion()`. Content is visible without animation. No infinite loops.

- [ ] **Step 5: Make baseline App test pass**

Compose `SiteHeader` and `HeroLauncher` in `App.tsx`. Run:

```bash
npm run nightly:test
npm run nightly:build
```

Expected: all current tests pass and built asset URLs begin with `/nightly/`.

- [ ] **Step 6: Commit hero shell**

```bash
git add nightly-src/src
git commit -m "feat: build nightly hub shell and launcher"
```

### Task 4: Build project field and private systems rail

**Files:**
- Create: `nightly-src/src/components/project-field.tsx`
- Create: `nightly-src/src/components/project-visual.tsx`
- Create: `nightly-src/src/components/systems-rail.tsx`
- Create: `nightly-src/src/components/external-link.tsx`
- Test: `nightly-src/src/components/project-field.test.tsx`
- Test: `nightly-src/src/components/systems-rail.test.tsx`

**Interfaces:**
- Consumes: typed destination arrays.
- Produces: `#projects` and `#systems` landmarks with complete destination navigation.

- [ ] **Step 1: Write failing content and access tests**

Tests must assert all seven public project names render, DulkirMod has no anchor, all three private systems render `Login required`, and external links include safe `rel="noreferrer"` behavior. Run and require FAIL.

- [ ] **Step 2: Implement project field**

Use one asymmetric CSS grid with exactly seven content cells. QuickRunLab spans 7 columns and Turtle Cave spans 5 at desktop. ViperSearch and SCP use image-led cells. ViperCode, ViperProxy, and DulkirMod use compact typographic cells. All collapse to one column below 768px.

Each linked project has one action label from data. Image load failure swaps to a mark plus project name without removing the link. Below-fold images use `loading="lazy"`, explicit dimensions, and shadcn `Skeleton` during decode.

- [ ] **Step 3: Implement private systems rail**

Use a horizontal responsive rail, not project cards. Each row contains official mark, name, one-line purpose, shadcn `Badge` reading `Login required`, and `Sign in`. Never include live status, host IP, port, credentials, or internal service UUID.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run nightly:test
npm run nightly:build
```

Expected: all tests and build pass.

```bash
git add nightly-src/src/components
git commit -m "feat: add project field and private systems"
```

### Task 5: Add real presence, about, footer, and resilient states

**Files:**
- Create: `nightly-src/src/components/presence.tsx`
- Create: `nightly-src/src/components/site-footer.tsx`
- Create: `nightly-src/src/hooks/use-lanyard.ts`
- Test: `nightly-src/src/hooks/use-lanyard.test.ts`
- Test: `nightly-src/src/components/presence.test.tsx`

**Interfaces:**
- Produces: `LanyardState = { status: "loading" | "ready" | "unavailable"; presence?: PresenceData }`.

- [ ] **Step 1: Write failing state tests**

Test loading skeleton, ready username/activity, fetch failure fallback, and WebSocket cleanup on unmount. Do not assert fake online state.

- [ ] **Step 2: Implement Lanyard hook**

Use the existing Discord user ID from the current homepage. Fetch once from `https://api.lanyard.rest/v1/users/{id}`, then subscribe through Lanyard WebSocket. Escape all server text by rendering React strings, not HTML. Close socket and timers in effect cleanup. Use bounded exponential reconnect capped at 15 seconds.

- [ ] **Step 3: Implement presence and footer**

Presence displays real username, avatar, status text, and at most one activity. Unavailable state says `Presence unavailable` and leaves social links usable. Footer includes GitHub, Discord, Modrinth, Blog, Email, Privacy, current year, and root-site link.

- [ ] **Step 4: Verify and commit**

```bash
npm run nightly:test
npm run nightly:build
git add nightly-src/src
git commit -m "feat: add resilient presence and footer"
```

### Task 6: Browser QA, accessibility, responsive polish, and generated output

**Files:**
- Create: `nightly-src/playwright.config.ts`
- Create: `nightly-src/e2e/hub.spec.ts`
- Modify: `nightly-src/package.json`
- Modify: `nightly-src/index.html`
- Create: `nightly/**`

**Interfaces:**
- Produces: browser-verified committed `/nightly/` static build.

- [ ] **Step 1: Add metadata and browser config**

Set title `Viper | Projects and systems`, description from approved hero copy, canonical `https://viperisuseful.cc/nightly/`, theme color tokens, Viper favicon, and `<meta name="robots" content="noindex, nofollow">`.

Configure Playwright `webServer.command` as `npm run dev -- --host 127.0.0.1`, base URL `http://127.0.0.1:5173/nightly/`, desktop Chromium, mobile Chromium at 390x844, and reduced-motion project.

- [ ] **Step 2: Write end-to-end acceptance tests**

Test H1, project/system anchors, theme toggle, mobile sheet, focus traversal, no horizontal overflow, image completion, redirect hrefs, and axe-core with zero serious or critical violations. Add `"e2e": "playwright test"` to `nightly-src/package.json`.

- [ ] **Step 3: Run full verification**

```bash
npm run nightly:test
npm run nightly:build
npm --prefix nightly-src exec playwright install chromium
npm run nightly:e2e
```

Expected: unit tests, TypeScript build, and all desktop/mobile/reduced-motion tests pass.

- [ ] **Step 4: Inspect real screenshots**

Capture 1440x1000 and 390x844 in both themes. Use `view_image` on every screenshot. Fix clipped type, low contrast, repeated card rhythm, image crop, mobile overflow, nav wrapping, focus visibility, and stale loading states. Repeat until browser output matches `DESIGN.md`.

- [ ] **Step 5: Run design preflight mechanically**

```bash
rg -n '—|–|cursor: none|addEventListener\(["'\'' ]scroll|background-clip:[[:space:]]*text|h-screen|#[[:xdigit:]]{3,8}' nightly-src/src
rg -n 'uppercase.*tracking|tracking.*uppercase' nightly-src/src
git diff --check
```

Expected: zero forbidden dash/cursor/scroll/gradient-text/h-screen/raw-hex hits. Eyebrow-style labels do not exceed one across the page.

- [ ] **Step 6: Commit implementation and build**

```bash
git add nightly-src nightly package.json package-lock.json
git commit -m "feat: ship nightly Viper project hub"
```

### Task 7: Publish `/nightly/` without changing root

**Files:**
- No new source files.
- GitHub mutation: push repository `main`.

**Interfaces:**
- Produces: `https://viperisuseful.cc/nightly/` from the committed build.

- [ ] **Step 1: Prove root content unchanged**

```bash
git diff origin/main...HEAD -- index.html theme.css theme.js blog privacy github discord instagram modrinth quickrunlab turtlecave
```

Expected: no changes outside documentation and nightly-specific files.

- [ ] **Step 2: Push approved preview**

```bash
git push origin main
```

Expected: fast-forward push. Monitor GitHub Pages until current commit is served.

- [ ] **Step 3: Verify public preview and root regression**

```bash
curl -fsSL https://viperisuseful.cc/nightly/ | rg 'Everything Viper runs'
curl -fsSL -o /dev/null -w '%{http_code}\n' https://viperisuseful.cc/
curl -fsSL -o /dev/null -w '%{http_code}\n' https://viperisuseful.cc/blog/
curl -fsSL -o /dev/null -w '%{http_code}\n' https://viperisuseful.cc/privacy/
```

Expected: preview contains approved heading and existing routes return `200`.

### Task 8: Add redirect-only subdomains safely

**Files:**
- Create: `/home/ubuntu/ops/redirects/turtle.viperisuseful.cc.conf`
- Create: `/home/ubuntu/ops/redirects/quickrunlab.viperisuseful.cc.conf`
- Create: `/etc/nginx/sites-available/turtle.viperisuseful.cc`
- Create: `/etc/nginx/sites-available/quickrunlab.viperisuseful.cc`
- Modify: `/home/ubuntu/AGENTS.md`
- Modify: `/home/ubuntu/docs/coolify-operations.md`

**Interfaces:**
- Produces: permanent, path-preserving public aliases with no application changes.

- [ ] **Step 1: Read Cloudflare and VM operating rules**

Read `/home/ubuntu/AGENTS.md`, `/home/ubuntu/docs/coolify-operations.md`, and the Cloudflare skill. Verify containers, Nginx, listeners, UFW, disk, DNS conflicts, both target sites, and available Cloudflare authentication without printing token values.

- [ ] **Step 2: Create protected rollback backup**

Create `/home/ubuntu/backups/viper-hub-redirects/<UTC timestamp>/` mode 700. Store mode-600 Coolify PostgreSQL custom dump, Nginx config archive, enabled-site map, UFW state, listeners, container map, existing Cloudflare DNS records, and `SHA256SUMS`. Validate every checksum before mutation.

- [ ] **Step 3: Stage redirect-only Nginx files**

Each initial HTTP configuration uses this exact behavior, with the corresponding host and target:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name turtle.viperisuseful.cc;
    return 301 https://turtlecave.xyz$request_uri;
}
```

QuickRunLab uses `quickrunlab.viperisuseful.cc` and `https://quickrunlab.tech$request_uri`. Run `sudo nginx -t` before reload.

- [ ] **Step 4: Create DNS-only records and issue certificates**

Using authenticated Cloudflare API access already configured on this VM, create non-conflicting `A` records for both aliases pointing to the same origin as `coolify.viperisuseful.cc`, initially `proxied: false`. Never print the bearer token. Wait for authoritative DNS, install staged Nginx sites, issue Let's Encrypt certificates with Certbot, and require `sudo nginx -t` success.

- [ ] **Step 5: Enable Cloudflare proxy and test redirects**

Set both records to `proxied: true`. Verify:

```bash
curl -sSI 'https://turtle.viperisuseful.cc/rules?from=hub'
curl -sSI 'https://quickrunlab.viperisuseful.cc/?from=hub'
```

Expected: `301` with locations `https://turtlecave.xyz/rules?from=hub` and `https://quickrunlab.tech/?from=hub`. Direct targets still return healthy responses.

- [ ] **Step 6: Document and regress all services**

Add both aliases to VM resource maps as redirect-only Nginx resources. Run routine VM verification from `AGENTS.md`, including Turtle worker health, QuickRunLab public response, Vaultwarden alive, Coolify, SCP, search, CDN, Opencode, Nginx, UFW, and disk.

### Task 9: Final verification and handoff

**Files:**
- Modify only if verification exposes a documented defect.

- [ ] **Step 1: Run full fresh verification**

```bash
npm run nightly:test
npm run nightly:build
npm run nightly:e2e
git diff --check
git status --short --branch
sudo nginx -t
```

Also verify public `/nightly/`, root pages, both redirects, all project links, both themes, reduced motion, fresh Turtle image, VM services, and disk usage.

- [ ] **Step 2: Confirm acceptance criteria**

Require every item in the spec's Testing and Acceptance section. Do not promote `/nightly/` to root. Report preview URL, redirect URLs, commits, tests, Lighthouse/browser findings, and any remaining non-blocking limitation.

- [ ] **Step 3: Preserve promotion boundary**

Wait for explicit user approval before replacing root homepage. Future promotion must preserve `/blog/`, `/privacy/`, existing social redirects, canonical metadata, and rollback copy of current `index.html`.
