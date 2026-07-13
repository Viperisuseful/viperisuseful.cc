# Nightly Palette and Logo Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the nightly hub's lime palette with an OpenCode-structured, Claude-warm terracotta system and replace every QuickRunLab/Turtle Cave screenshot with the projects' real logos.

**Architecture:** Keep the existing React/shadcn composition and change only semantic theme tokens, destination visual metadata, logo assets, and the hero/project visual treatments. Contract tests lock the palette and logo registry before generated static output is rebuilt. The root site stays byte-for-byte unchanged.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, shadcn/Radix, Vitest, Playwright, axe-core.

## Global Constraints

- Scope is `/nightly/` only; the root homepage and existing subdirectories must not change.
- Light canvas is `oklch(0.98 0.008 85)` with ink `oklch(0.18 0.007 60)`.
- Light primary is `oklch(0.61 0.145 39)`; dark primary is `oklch(0.72 0.125 39)`.
- No lime interface token remains; Turtle Cave green is allowed only inside its logo artwork.
- QuickRunLab source logo is `/home/ubuntu/quickrunlab/static/app-logo.png`.
- Turtle Cave source logo is `/home/ubuntu/turtle-dashboard/public/img/favicon-turtle.png`.
- ViperSearch and Screenshot API retain their existing screenshots.
- Preserve WCAG AA contrast, keyboard navigation, 44px touch targets, reduced motion, and light/dark themes.
- Generated output remains committed under `nightly/` for GitHub Pages.

---

### Task 1: Lock and implement the semantic palette

**Files:**
- Create: `nightly-src/src/theme-contract.test.ts`
- Modify: `nightly-src/src/index.css`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: semantic CSS variables already used by Tailwind/shadcn and custom components.
- Produces: exact light/dark palette contract consumed by all existing components.

- [ ] **Step 1: Write the failing theme contract test**

```ts
// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("./index.css", import.meta.url), "utf8")

describe("nightly palette", () => {
  it("uses the approved terracotta palette and removes lime UI tokens", () => {
    expect(css).toContain("--background: oklch(0.98 0.008 85)")
    expect(css).toContain("--primary: oklch(0.61 0.145 39)")
    expect(css).toContain("--primary: oklch(0.72 0.125 39)")
    expect(css).not.toContain("oklch(0.79 0.19 128)")
    expect(css).not.toContain("oklch(0.84 0.20 128)")
  })
})
```

- [ ] **Step 2: Run the contract test and verify red**

Run: `npm --prefix nightly-src run test -- --run src/theme-contract.test.ts`

Expected: FAIL because the existing CSS still contains the lime palette.

- [ ] **Step 3: Replace light and dark semantic tokens**

In `nightly-src/src/index.css`, replace the current `:root` and `.dark` color
values with the exact token tables from the approved spec. Keep the existing
radius, sidebar mappings, and Tailwind semantic aliases. Map chart placeholders
to terracotta, warm charcoal, muted brown, and restrained cool contrast values;
do not introduce a second interface accent.

The required primary token excerpt is:

```css
:root {
  --background: oklch(0.98 0.008 85);
  --foreground: oklch(0.18 0.007 60);
  --primary: oklch(0.61 0.145 39);
  --primary-foreground: oklch(0.98 0.008 85);
  --ring: oklch(0.56 0.145 39);
  --surface-strong: oklch(0.90 0.014 80);
  --wash: oklch(0.91 0.035 45);
}

.dark {
  --background: oklch(0.14 0.009 55);
  --foreground: oklch(0.93 0.008 82);
  --primary: oklch(0.72 0.125 39);
  --primary-foreground: oklch(0.15 0.010 55);
  --ring: oklch(0.72 0.125 39);
  --surface-strong: oklch(0.25 0.013 55);
  --wash: oklch(0.23 0.040 35);
}
```

- [ ] **Step 4: Update the design-system color documentation**

Replace the color table and palette prose in `DESIGN.md` with the approved
light/dark values. State that UI chrome uses terracotta and warm ink, while
project logos may retain their own brand colors.

- [ ] **Step 5: Run the focused test and full unit suite**

Run: `npm --prefix nightly-src run test -- --run src/theme-contract.test.ts`

Expected: 1 file passed.

Run: `npm run nightly:test`

Expected: all test files pass.

- [ ] **Step 6: Commit the palette**

```bash
git add DESIGN.md nightly-src/src/index.css nightly-src/src/theme-contract.test.ts
git commit -m "style: replace nightly lime palette"
```

---

### Task 2: Replace QuickRunLab and Turtle Cave screenshots with logos

**Files:**
- Create: `nightly-src/public/marks/quickrunlab.png`
- Create: `nightly-src/public/marks/turtle-cave.png`
- Create: `nightly-src/src/components/hero-launcher.test.tsx`
- Modify: `nightly-src/src/data/destinations.test.ts`
- Modify: `nightly-src/src/components/project-field.test.tsx`
- Modify: `nightly-src/src/data/destinations.ts`
- Modify: `nightly-src/src/components/hero-launcher.tsx`
- Modify: `nightly-src/src/index.css`
- Delete: `nightly-src/public/media/quickrunlab.webp`
- Delete: `nightly-src/public/media/turtle-cave.webp`

**Interfaces:**
- Consumes: `Destination.mark?: string`, `ProjectVisual`, and the existing hero launcher item map.
- Produces: QuickRunLab mark `/nightly/marks/quickrunlab.png` and Turtle Cave mark `/nightly/marks/turtle-cave.png` in both hero and project field.

- [ ] **Step 1: Extend the destination registry test**

Add this test to `nightly-src/src/data/destinations.test.ts`:

```ts
it("uses logos instead of screenshots for QuickRunLab and Turtle Cave", () => {
  const quickrunlab = publicProjects.find((item) => item.id === "quickrunlab")
  const turtle = publicProjects.find((item) => item.id === "turtle-cave")

  expect(quickrunlab?.mark).toBe("/nightly/marks/quickrunlab.png")
  expect(quickrunlab?.image).toBeUndefined()
  expect(turtle?.mark).toBe("/nightly/marks/turtle-cave.png")
  expect(turtle?.image).toBeUndefined()
})
```

- [ ] **Step 2: Add hero and project rendering tests**

Create `nightly-src/src/components/hero-launcher.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HeroLauncher } from "./hero-launcher"

describe("HeroLauncher", () => {
  it("uses project logos for QuickRunLab and Turtle Cave", () => {
    render(<HeroLauncher />)
    expect(screen.getByRole("img", { name: "QuickRunLab logo" })).toHaveAttribute(
      "src",
      "/nightly/marks/quickrunlab.png",
    )
    expect(screen.getByRole("img", { name: "Turtle Cave logo" })).toHaveAttribute(
      "src",
      "/nightly/marks/turtle-cave.png",
    )
  })
})
```

Extend `project-field.test.tsx` to assert that the two logo paths occur in the
rendered project field and the two old screenshot paths do not.

- [ ] **Step 3: Run the new tests and verify red**

Run:

```bash
npm --prefix nightly-src run test -- --run \
  src/data/destinations.test.ts \
  src/components/hero-launcher.test.tsx \
  src/components/project-field.test.tsx
```

Expected: FAIL because the registry and hero still reference screenshots.

- [ ] **Step 4: Copy the approved local brand assets**

```bash
install -m 644 /home/ubuntu/quickrunlab/static/app-logo.png \
  nightly-src/public/marks/quickrunlab.png
install -m 644 /home/ubuntu/turtle-dashboard/public/img/favicon-turtle.png \
  nightly-src/public/marks/turtle-cave.png
```

Verify:

```bash
file nightly-src/public/marks/quickrunlab.png nightly-src/public/marks/turtle-cave.png
```

Expected: QuickRunLab is 1000x1000 RGBA PNG; Turtle Cave is 128x128 RGBA PNG.

- [ ] **Step 5: Switch destination records to marks**

In `nightly-src/src/data/destinations.ts`, use:

```ts
{
  id: "quickrunlab",
  name: "QuickRunLab",
  // existing description and href
  mark: "/nightly/marks/quickrunlab.png",
  // existing access, action, and tags
}

{
  id: "turtle-cave",
  name: "Turtle Cave",
  // existing description and href
  mark: "/nightly/marks/turtle-cave.png",
  // existing access, action, and tags
}
```

Remove their `image` fields only. Do not change ViperSearch or Screenshot API.

- [ ] **Step 6: Switch hero launcher metadata and rendering**

Change both launcher items from `image` to `mark`, with dimensions 1000x1000
and 128x128. Render the logo with truthful alt text and a mark class:

```tsx
<img
  className="launcher-item__mark"
  src={item.mark}
  alt={`${item.label} logo`}
  width={item.width}
  height={item.height}
/>
```

Keep the existing external links, labels, Motion timing, and hover behavior.

- [ ] **Step 7: Add project-specific logo stages**

Replace screenshot-oriented launcher image styling with contained logo styling.
Add project-specific CSS using the existing cell classes:

```css
.launcher-item {
  display: grid;
  place-items: center;
  padding: 1.25rem 1.25rem 3.1rem;
}

.launcher-item__mark {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.launcher-item--quick {
  background: oklch(0.18 0.007 60);
}

.launcher-item--quick .launcher-item__mark {
  max-width: 10rem;
}

.launcher-item--turtle .launcher-item__mark {
  max-width: 6rem;
}

.project-cell--quickrunlab .project-mark,
.project-cell--turtle-cave .project-mark {
  min-height: clamp(18rem, 28vw, 24rem);
}

.project-cell--quickrunlab .project-mark {
  background: oklch(0.18 0.007 60);
}

.project-cell--quickrunlab .project-mark img {
  width: min(52%, 15rem);
  max-height: 15rem;
}

.project-cell--turtle-cave .project-mark img {
  width: 7rem;
  max-height: 7rem;
}
```

Use `var(--secondary)` for the Turtle hero stage so it stays within the page
palette. Keep the logo's own green untouched.

- [ ] **Step 8: Remove old source screenshots and run tests**

```bash
rm nightly-src/public/media/quickrunlab.webp
rm nightly-src/public/media/turtle-cave.webp
npm --prefix nightly-src run test -- --run \
  src/data/destinations.test.ts \
  src/components/hero-launcher.test.tsx \
  src/components/project-field.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 9: Commit the logo treatment**

```bash
git add nightly-src
git commit -m "style: replace project screenshots with logos"
```

---

### Task 3: Rebuild and verify the complete nightly output

**Files:**
- Modify: `nightly/index.html`
- Modify: `nightly/assets/*`
- Create: `nightly/marks/quickrunlab.png`
- Create: `nightly/marks/turtle-cave.png`
- Delete: `nightly/media/quickrunlab.webp`
- Delete: `nightly/media/turtle-cave.webp`
- Modify: `nightly-src/e2e/hub.spec.ts` only if selectors need to reflect logo alt text.

**Interfaces:**
- Consumes: tested nightly source and Vite `outDir: ../nightly`.
- Produces: deployable GitHub Pages output at `/nightly/`.

- [ ] **Step 1: Build static output**

Run: `npm run nightly:build`

Expected: TypeScript and Vite complete successfully; generated marks exist and
the deleted screenshot files do not.

- [ ] **Step 2: Run static contract scans**

```bash
test -f nightly/marks/quickrunlab.png
test -f nightly/marks/turtle-cave.png
test ! -e nightly/media/quickrunlab.webp
test ! -e nightly/media/turtle-cave.webp
! rg -n 'quickrunlab\.webp|turtle-cave\.webp|0\.79 0\.19 128|0\.84 0\.20 128' \
  nightly-src/src nightly
```

Expected: all checks exit zero and ripgrep finds no stale reference.

- [ ] **Step 3: Run code-quality and dependency gates**

```bash
npm run nightly:test
cd nightly-src
npx oxlint src e2e
npm audit --audit-level=moderate
```

Expected: all unit tests pass, oxlint reports no warnings/errors, and audit
reports zero vulnerabilities.

- [ ] **Step 4: Run the complete browser matrix**

Run: `npm run nightly:e2e`

Expected: all desktop, mobile, and reduced-motion tests pass; axe reports no
serious or critical violations; screenshots are written under `/tmp`.

- [ ] **Step 5: Inspect light/dark desktop/mobile screenshots**

Inspect:

- `/tmp/viper-nightly-desktop-viewport.png`
- `/tmp/viper-nightly-mobile-viewport.png`
- `/tmp/viper-nightly-dark-1440.png`
- `/tmp/viper-nightly-dark-390.png`

Verify logo balance, CTA contrast, focus visibility, no old screenshots, no
horizontal overflow, and no logo crop.

- [ ] **Step 6: Prove root-site isolation**

```bash
git diff --name-only origin/main...HEAD -- \
  index.html theme.css theme.js blog privacy github discord instagram modrinth \
  quickrunlab turtlecave
```

Expected: no output.

- [ ] **Step 7: Commit generated output**

```bash
git add nightly
git commit -m "build: generate revised nightly preview"
```

---

### Task 4: Review, publish, and verify live behavior

**Files:**
- Review: all changes from `origin/main...HEAD`
- Publish: GitHub repository `Viperisuseful/viperisuseful.cc`, branch `main`

**Interfaces:**
- Consumes: clean reviewed branch with exact generated tree.
- Produces: live `https://viperisuseful.cc/nightly/` while leaving the root site and Cloudflare redirects unchanged.

- [ ] **Step 1: Run final diff and secret review**

```bash
git diff --check
git status --short --branch
git diff --stat origin/main...HEAD
rg -n '(cfat_|api[_-]?key|client[_-]?secret|password\s*=)' \
  docs/superpowers nightly-src nightly || true
```

Expected: clean whitespace, only scoped files, and no credential material.

- [ ] **Step 2: Run verification-before-completion gates**

Re-run build, unit tests, oxlint, audit, and full Playwright matrix. Do not rely
on Task 3 output for the completion claim.

- [ ] **Step 3: Publish the exact branch tree**

Try a normal fast-forward push first:

```bash
git push origin HEAD:main
```

If shell GitHub authentication remains unavailable, use the connected GitHub
App's Git object API to create blobs/tree/commit from the exact local tree and
move `main` with `force: false`. Verify the remote commit tree SHA equals
`git rev-parse HEAD^{tree}`.

- [ ] **Step 4: Verify GitHub Pages and redirects live**

```bash
curl -fsS https://viperisuseful.cc/nightly/ | rg -q 'Everything Viper runs, in one place.'
test "$(curl -sS -o /dev/null -w '%{redirect_url}' \
  'https://quickrunlab.viperisuseful.cc/palette-check?x=1')" = \
  'https://quickrunlab.tech/palette-check?x=1'
test "$(curl -sS -o /dev/null -w '%{redirect_url}' \
  'https://turtle.viperisuseful.cc/palette-check?x=1')" = \
  'https://turtlecave.xyz/palette-check?x=1'
```

Expected: nightly returns the revised app and both redirects preserve path/query.

- [ ] **Step 5: Run a live browser check**

Open the live nightly page at 1440x1000 and 390x844 in light and dark mode.
Require HTTP 200, the expected title/H1, zero console or page errors, zero
broken images, and no horizontal overflow. Save a final live screenshot under
`/tmp/viper-nightly-palette-live.png`.
