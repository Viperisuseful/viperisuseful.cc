# Nightly Hero Alternatives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish three isolated hero-art previews at `/nightly/1`, `/nightly/2`, and `/nightly/3` while keeping `/nightly` unchanged.

**Architecture:** A pure pathname resolver selects one `HeroVariant`. The existing app passes that value into a focused `HeroArt` component inside the current launcher geometry. A post-build script copies the production index into three directories so GitHub Pages serves real `/nightly/N/` routes instead of returning 404.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Motion, Vitest, Testing Library, Playwright, axe-core, GitHub Pages.

## Global Constraints

- Keep `/nightly` visually and behaviorally unchanged.
- Change only central hero artwork and preview-route selection.
- Keep existing navigation, copy, project links, cards, sections, theme control, and accessibility behavior.
- Add no runtime dependency.
- Use one existing terracotta accent and semantic light/dark tokens.
- Every preview must work at 390 CSS pixels without horizontal overflow.
- Alternative 3 uses a local optimized WebP with fixed dimensions and no generated words.
- Do not change Nginx, Cloudflare, Coolify, DNS, or any other application.

---

### Task 1: Pathname Resolver and Static Preview Directories

**Files:**
- Create: `nightly-src/src/lib/hero-variant.ts`
- Create: `nightly-src/src/lib/hero-variant.test.ts`
- Create: `nightly-src/scripts/create-preview-routes.mjs`
- Modify: `nightly-src/package.json`

**Interfaces:**
- Produces: `HeroVariant = "original" | "monogram" | "signal" | "illustration"`
- Produces: `resolveHeroVariant(pathname: string): HeroVariant`
- Produces: build directories `nightly/1/index.html`, `nightly/2/index.html`, and `nightly/3/index.html`

- [ ] **Step 1: Write the failing resolver test**

```ts
import { describe, expect, it } from "vitest"

import { resolveHeroVariant } from "./hero-variant"

describe("resolveHeroVariant", () => {
  it.each([
    ["/nightly/1", "monogram"],
    ["/nightly/1/", "monogram"],
    ["/nightly/2", "signal"],
    ["/nightly/2/", "signal"],
    ["/nightly/3", "illustration"],
    ["/nightly/3/", "illustration"],
    ["/nightly", "original"],
    ["/nightly/", "original"],
    ["/nightly/unknown", "original"],
  ] as const)("maps %s to %s", (pathname, expected) => {
    expect(resolveHeroVariant(pathname)).toBe(expected)
  })
})
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm run test -- --run src/lib/hero-variant.test.ts`

Expected: FAIL because `./hero-variant` does not exist.

- [ ] **Step 3: Implement the resolver**

```ts
export type HeroVariant = "original" | "monogram" | "signal" | "illustration"

export function resolveHeroVariant(pathname: string): HeroVariant {
  const normalized = `/${pathname.split("/").filter(Boolean).join("/")}`

  if (normalized === "/nightly/1") return "monogram"
  if (normalized === "/nightly/2") return "signal"
  if (normalized === "/nightly/3") return "illustration"
  return "original"
}
```

- [ ] **Step 4: Add GitHub Pages preview-directory generation**

Create `scripts/create-preview-routes.mjs`:

```js
import { copyFile, mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const outputRoot = resolve(import.meta.dirname, "../../nightly")

await Promise.all(
  ["1", "2", "3"].map(async (route) => {
    const routeDirectory = resolve(outputRoot, route)
    await mkdir(routeDirectory, { recursive: true })
    await copyFile(resolve(outputRoot, "index.html"), resolve(routeDirectory, "index.html"))
  }),
)
```

Change the build script to:

```json
"build": "tsc -b && vite build && node scripts/create-preview-routes.mjs"
```

- [ ] **Step 5: Verify resolver and route output**

Run:

```bash
npm run test -- --run src/lib/hero-variant.test.ts
npm run build
cmp ../nightly/index.html ../nightly/1/index.html
cmp ../nightly/index.html ../nightly/2/index.html
cmp ../nightly/index.html ../nightly/3/index.html
```

Expected: test PASS, build exit 0, all three `cmp` commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add nightly-src/package.json nightly-src/scripts/create-preview-routes.mjs nightly-src/src/lib/hero-variant.ts nightly-src/src/lib/hero-variant.test.ts
git commit -m "feat: add nightly hero preview routes"
```

---

### Task 2: Hero Art Component and Illustration Asset

**Files:**
- Create: `nightly-src/src/components/hero-art.tsx`
- Create: `nightly-src/src/components/hero-art.test.tsx`
- Create: `nightly-src/public/marks/viper-snake-terminal.webp`

**Interfaces:**
- Consumes: `HeroVariant` from `@/lib/hero-variant`
- Produces: `HeroArt({ variant }: { variant: HeroVariant })`
- Produces: one element with `data-testid="hero-art-${variant}"`

- [ ] **Step 1: Write failing component tests**

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HeroArt } from "./hero-art"

describe("HeroArt", () => {
  it.each(["monogram", "signal"] as const)("renders the %s artwork", (variant) => {
    render(<HeroArt variant={variant} />)
    expect(screen.getByTestId(`hero-art-${variant}`)).toBeInTheDocument()
  })

  it("keeps the original artwork on the base route", () => {
    render(<HeroArt variant="original" />)
    expect(screen.getByRole("img", { name: "Viper is useful" })).toHaveAttribute(
      "src",
      "/nightly/marks/viper.webp",
    )
  })

  it("renders the local illustration without spoken duplicate content", () => {
    render(<HeroArt variant="illustration" />)
    const image = screen.getByTestId("hero-art-illustration")
    expect(image).toHaveAttribute("src", "/nightly/marks/viper-snake-terminal.webp")
    expect(image).toHaveAttribute("alt", "")
  })
})
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm run test -- --run src/components/hero-art.test.tsx`

Expected: FAIL because `HeroArt` does not exist.

- [ ] **Step 3: Generate and optimize alternative 3**

Use the image generation tool with this exact prompt:

```text
Square editorial illustration for a developer portfolio. A friendly hand-drawn snake curls into a clear V shape around a simple terminal chevron cursor. Flat risograph print style, warm off-white paper background, terracotta snake, espresso-charcoal ink outlines, slightly imperfect organic texture, generous negative space, centered composition, bold readable silhouette at phone size. No words, no letters, no typography, no logo, no gradients, no mock interface, no border.
```

Save the generated source outside the repository, inspect it, then convert it to
`nightly-src/public/marks/viper-snake-terminal.webp` at 1024 by 1024 with WebP
quality 86. Use a temporary Node script with Playwright canvas conversion if the
generation tool does not return WebP directly. Remove the temporary converter
after verifying `file` reports a WebP image.

- [ ] **Step 4: Implement the focused component**

```tsx
import type { HeroVariant } from "@/lib/hero-variant"

export function HeroArt({ variant }: { variant: HeroVariant }) {
  if (variant === "original") {
    return (
      <img
        src="/nightly/marks/viper.webp"
        alt="Viper is useful"
        width="768"
        height="768"
      />
    )
  }

  if (variant === "illustration") {
    return (
      <img
        className="hero-art__illustration"
        data-testid="hero-art-illustration"
        src="/nightly/marks/viper-snake-terminal.webp"
        alt=""
        width="1024"
        height="1024"
      />
    )
  }

  if (variant === "signal") {
    return (
      <div className="hero-art hero-art--signal" data-testid="hero-art-signal" aria-hidden="true">
        <span className="hero-art__signal-core">V</span>
      </div>
    )
  }

  return (
    <div className="hero-art hero-art--monogram" data-testid="hero-art-monogram" aria-hidden="true">
      <span className="hero-art__monogram">V</span>
      <span className="hero-art__signature">viperisuseful</span>
    </div>
  )
}
```

- [ ] **Step 5: Run focused tests and verify green**

Run: `npm run test -- --run src/components/hero-art.test.tsx`

Expected: 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add nightly-src/public/marks/viper-snake-terminal.webp nightly-src/src/components/hero-art.tsx nightly-src/src/components/hero-art.test.tsx
git commit -m "feat: add nightly hero artwork options"
```

---

### Task 3: Wire Variants Into the Existing Launcher

**Files:**
- Modify: `nightly-src/src/main.tsx`
- Modify: `nightly-src/src/App.tsx`
- Modify: `nightly-src/src/components/hero-launcher.tsx`
- Modify: `nightly-src/src/components/hero-launcher.test.tsx`
- Modify: `nightly-src/src/index.css`

**Interfaces:**
- Consumes: `resolveHeroVariant(window.location.pathname)`
- Consumes: `HeroArt` and `HeroVariant`
- Produces: `<App heroVariant={heroVariant} />`
- Produces: `<HeroLauncher variant={heroVariant} />`
- Produces: `.launcher-brand--original|monogram|signal|illustration`

- [ ] **Step 1: Extend launcher tests and verify red**

Add:

```tsx
it.each(["monogram", "signal", "illustration"] as const)(
  "renders the %s hero variant",
  (variant) => {
    render(<HeroLauncher variant={variant} />)
    expect(screen.getByTestId(`hero-art-${variant}`)).toBeInTheDocument()
    expect(screen.getByTestId("launcher-brand")).toHaveAttribute("data-hero-variant", variant)
  },
)
```

Run: `npm run test -- --run src/components/hero-launcher.test.tsx`

Expected: FAIL because `HeroLauncher` does not accept `variant`.

- [ ] **Step 2: Wire variant data without changing base behavior**

In `main.tsx`:

```tsx
import { resolveHeroVariant } from "@/lib/hero-variant"

const heroVariant = resolveHeroVariant(window.location.pathname)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App heroVariant={heroVariant} />
  </StrictMode>,
)
```

In `App.tsx`, accept `heroVariant: HeroVariant = "original"` and pass it to
`<HeroLauncher variant={heroVariant} />`.

In `hero-launcher.tsx`, accept `variant: HeroVariant = "original"`, set
`data-testid="launcher-brand"`, set `data-hero-variant={variant}`, append
`launcher-brand--${variant}` to the class name, and replace the inline original
image with `<HeroArt variant={variant} />`.

- [ ] **Step 3: Add variant styling**

Keep `.launcher-brand` geometry and motion intact. Add these responsibilities:

```css
.launcher-brand--monogram {
  color: var(--primary-foreground);
  background: var(--primary);
}

.hero-art--monogram,
.hero-art--signal {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.hero-art--monogram::before {
  content: "";
  position: absolute;
  inset: clamp(1rem, 3vw, 2rem);
  border: 1px solid color-mix(in oklch, var(--primary-foreground), transparent 64%);
  border-radius: 50%;
}

.hero-art__monogram {
  font-size: clamp(8rem, 24vw, 19rem);
  font-weight: 760;
  line-height: 0.8;
  letter-spacing: -0.09em;
}

.hero-art__signature {
  position: absolute;
  right: clamp(1rem, 3vw, 2rem);
  bottom: clamp(1rem, 3vw, 2rem);
  font-family: var(--font-mono);
  font-size: clamp(0.65rem, 1.5vw, 0.9rem);
  letter-spacing: 0.08em;
}

.launcher-brand--signal {
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border);
}

.hero-art--signal {
  background:
    repeating-radial-gradient(
      circle at center,
      transparent 0 3rem,
      color-mix(in oklch, var(--primary), transparent 74%) 3.05rem 3.12rem
    ),
    radial-gradient(circle at 72% 24%, var(--wash), transparent 38%);
}

.hero-art__signal-core {
  display: grid;
  place-items: center;
  width: clamp(7rem, 18vw, 11rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: clamp(4rem, 11vw, 7rem);
  font-weight: 760;
}

.launcher-brand--illustration {
  background: var(--card);
}

.launcher-brand--illustration .hero-art__illustration {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Add mobile rules only where visual inspection proves a clamp is insufficient.
Do not move the QuickRunLab, Turtle Cave, VS, or SCP cards.

- [ ] **Step 4: Verify component and full unit tests**

Run:

```bash
npm run test -- --run src/components/hero-launcher.test.tsx src/components/hero-art.test.tsx src/lib/hero-variant.test.ts
npm run test -- --run
```

Expected: focused and full suites PASS.

- [ ] **Step 5: Commit**

```bash
git add nightly-src/src/main.tsx nightly-src/src/App.tsx nightly-src/src/components/hero-launcher.tsx nightly-src/src/components/hero-launcher.test.tsx nightly-src/src/index.css
git commit -m "feat: wire nightly hero variants"
```

---

### Task 4: Route-Level Browser Verification

**Files:**
- Create: `nightly-src/e2e/hero-options.spec.ts`
- Modify only if a real bug is found: files from Tasks 1-3

**Interfaces:**
- Consumes: `/nightly/1/`, `/nightly/2/`, `/nightly/3/`
- Verifies: `data-hero-variant`, no overflow, no broken images, theme toggle, light/dark accessibility

- [ ] **Step 1: Add the route-level E2E contract**

```ts
import axeCore from "axe-core"
import { expect, test } from "@playwright/test"

for (const option of [
  { route: "1/", variant: "monogram" },
  { route: "2/", variant: "signal" },
  { route: "3/", variant: "illustration" },
] as const) {
  test(`${option.variant} hero is healthy`, async ({ page }, testInfo) => {
    const errors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })

    await page.goto(option.route)
    await expect(page.getByTestId("launcher-brand")).toHaveAttribute(
      "data-hero-variant",
      option.variant,
    )
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    expect(
      await page.locator("img").evaluateAll((images) =>
        images.filter((image) => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0).length,
      ),
    ).toBe(0)
    expect(errors).toEqual([])

    await page.addScriptTag({ content: axeCore.source })
    const serious = await page.evaluate(async () => {
      const result = await (window as typeof window & { axe: typeof import("axe-core") }).axe.run()
      return result.violations.filter(({ impact }) => impact === "serious" || impact === "critical")
    })
    expect(serious).toEqual([])

    await page.screenshot({
      path: `/tmp/viper-nightly-option-${option.variant}-${testInfo.project.name}.png`,
      fullPage: false,
    })
  })
}
```

- [ ] **Step 2: Run browser checks and inspect every screenshot**

Run:

```bash
npm run build
npm run e2e
```

Expected: existing 12 cases plus nine option cases PASS across desktop, mobile,
and reduced-motion projects. Inspect all six unique desktop/mobile option
screenshots for overlap, clipping, unreadable artwork, and visual imbalance.

- [ ] **Step 3: Run full quality gate**

Run:

```bash
npm run lint
npm audit --audit-level=moderate
npm run test -- --run
npm run build
npm run e2e
git diff --check
```

Expected: lint exit 0, zero audit vulnerabilities, all unit and browser tests
PASS, build exit 0, diff check exit 0.

- [ ] **Step 4: Commit generated output**

```bash
git add nightly-src/e2e/hero-options.spec.ts nightly
git commit -m "build: publish nightly hero previews"
```

---

### Task 5: Publish and Verify Live Previews

**Files:**
- No source changes unless live verification exposes a reproducible defect.

**Interfaces:**
- Consumes: production branch and GitHub Pages deployment
- Produces: live `/nightly/1/`, `/nightly/2/`, `/nightly/3/`

- [ ] **Step 1: Review scope before publication**

Run:

```bash
git status --short --branch
git diff --check origin/main...HEAD
git diff --name-status origin/main...HEAD
git diff --name-only origin/main...HEAD -- index.html theme.css theme.js blog privacy github discord instagram modrinth quickrunlab turtlecave
```

Expected: clean worktree; the final command prints nothing because the main site
and legacy routes are untouched.

- [ ] **Step 2: Publish a fast-forward commit to `main`**

Publish only the reviewed tree. Confirm remote `main` still points to the plan's
base lineage before updating it. Do not force-push.

- [ ] **Step 3: Monitor deployment to terminal success**

Poll the public HTML until it references the new generated asset hashes. Do not
treat the push or webhook as deployment success.

- [ ] **Step 4: Verify all live routes**

For each route `/nightly/1/`, `/nightly/2/`, and `/nightly/3/`, verify:

- HTTP 200
- intended `data-hero-variant`
- no console or page errors
- no broken images
- no horizontal overflow at 1440 by 1000 and 390 by 844
- theme toggle changes the document theme
- serious and critical axe violations equal zero in light and dark themes

- [ ] **Step 5: Hand off the three links**

Report the three live URLs, the test counts, the published commit, and that
`/nightly` remained unchanged. Ask the user to reply with `1`, `2`, or `3`.
