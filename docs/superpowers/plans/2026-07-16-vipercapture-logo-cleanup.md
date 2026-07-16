# ViperCapture Logo Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the translucent lower-right triangle from every ViperCapture mark and make the hub's featured ViperCapture tile fill its existing frame.

**Architecture:** Keep the existing cobalt rounded-square SVG and white interlocking outlines, deleting only the decorative corner path. Add a ViperCapture-specific hub sizing rule, then regenerate the production email PNG from the cleaned production SVG so every surface shares the same artwork.

**Tech Stack:** SVG, CSS, React/Vite, Vitest, Playwright, Python `unittest`, FastAPI, Docker

## Global Constraints

- Preserve the existing one-pixel hub frame and rounded corners.
- Do not alter QuickRunLab or any other project mark.
- Do not change ViperCapture routing, authentication, billing, environment variables, databases, or persistent storage.
- Do not commit, push, or deploy without explicit user authorization.
- Production rollback is a normal Git revert; never force-push.

---

### Task 1: Clean and expand the hub mark

**Files:**
- Modify: `nightly-src/e2e/hub.spec.ts:8-60`
- Modify: `nightly-src/public/marks/vipercapture.svg:1-7`
- Generated: `marks/vipercapture.svg`
- Modify: `nightly-src/src/index.css:523-547`

**Interfaces:**
- Consumes: the `showcase-project__mark--vipercapture` class emitted by `HeroLauncher` and `/marks/vipercapture.svg`.
- Produces: a triangle-free SVG and an image whose rendered content box fills the framed showcase mark.

- [x] **Step 1: Add failing rendered-contract assertions**

In `nightly-src/e2e/hub.spec.ts`, extend `loads complete hub without runtime errors` after the ViperCapture link assertion:

```ts
  const viperCaptureMark = page.locator(".showcase-project__mark--vipercapture")
  const viperCaptureImage = viperCaptureMark.locator("img")
  const markDimensions = await viperCaptureMark.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }))
  const imageDimensions = await viperCaptureImage.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }))
  expect(imageDimensions).toEqual(markDimensions)

  const markSource = await page.evaluate(async () =>
    fetch("/marks/vipercapture.svg").then((response) => response.text()),
  )
  expect(markSource).not.toContain("M38 64H64V38C57 48 48 57 38 64Z")
```

- [x] **Step 2: Run the targeted browser test and verify failure**

Run from `nightly-src`:

```bash
npm run e2e -- --grep "loads complete hub without runtime errors"
```

Expected: FAIL because the image is inset and the SVG still contains the corner path.

- [x] **Step 3: Remove the hub SVG corner path**

Change `nightly-src/public/marks/vipercapture.svg` to:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title">
  <title id="title">ViperCapture mark</title>
  <rect width="64" height="64" rx="16" fill="#3157e5"/>
  <rect x="15" y="15" width="24" height="24" rx="7" fill="none" stroke="#f5f7ff" stroke-width="5"/>
  <rect x="25" y="25" width="24" height="24" rx="7" fill="none" stroke="#f5f7ff" stroke-width="5"/>
</svg>
```

- [x] **Step 4: Make only the featured ViperCapture image edge-to-edge**

After `.showcase-project__mark--quickrunlab img` in `nightly-src/src/index.css`, add:

```css
.showcase-project__mark--vipercapture img {
  width: 100%;
  height: 100%;
}
```

The base rule handles larger viewports without changing other marks. Inside `@media (max-width: 820px)`, repeat the same ViperCapture-specific rule immediately after the generic three-rem mark rule so the later mobile cascade also stays edge-to-edge.

- [x] **Step 5: Run the targeted browser test and verify success**

Run from `nightly-src`:

```bash
npm run e2e -- --grep "loads complete hub without runtime errors"
```

Expected: all desktop, mobile, and reduced-motion instances PASS.

- [x] **Step 6: Run the complete hub checks and rebuild generated output**

Run from `nightly-src`:

```bash
npm run lint
npm run test -- --run
npm audit --omit=dev
npm run build
npm run e2e
```

Expected: lint exits 0, 22 or more unit tests pass, audit reports 0 production vulnerabilities, build exits 0, and all 21 or more browser tests pass.

- [ ] **Step 7: Commit only when explicitly authorized**

```bash
git add marks/vipercapture.svg nightly-src/public/marks/vipercapture.svg nightly-src/src/index.css nightly-src/e2e/hub.spec.ts index.html 404.html hub-assets docs/superpowers/specs/2026-07-16-vipercapture-logo-cleanup-design.md docs/superpowers/plans/2026-07-16-vipercapture-logo-cleanup.md
git commit -m "Fix ViperCapture logo framing"
```

Do not run this step unless the user explicitly requests a commit.

---

### Task 2: Clean ViperCapture's product and email marks

**Files:**
- Modify: `test_site.py:12-40`
- Modify: `static/vipercapture-mark.svg:1-7`
- Modify: `static/vipercapture-email-mark.png`

**Interfaces:**
- Consumes: the production templates' existing `/static/vipercapture-mark.svg` references and `mail_service.EMAIL_MARK_PATH`.
- Produces: matching triangle-free SVG and 128-by-128 PNG marks without changing URLs or email attachment behavior.

- [x] **Step 1: Add a failing production asset test**

Add to `SiteContractTest` in `test_site.py`:

```python
    def test_brand_mark_has_no_corner_overlay(self):
        mark = (ROOT / "static" / "vipercapture-mark.svg").read_text(encoding="utf-8")
        self.assertNotIn("M38 64H64V38C57 48 48 57 38 64Z", mark)
        self.assertEqual(mark.count('stroke="#f5f7ff"'), 2)
```

- [x] **Step 2: Run the targeted test and verify failure**

```bash
/home/ubuntu/screenshot-api/.venv/bin/python -m unittest test_site.SiteContractTest.test_brand_mark_has_no_corner_overlay -v
```

Expected: FAIL because the SVG still contains the corner path.

- [x] **Step 3: Remove the production SVG corner path**

Change `static/vipercapture-mark.svg` to the exact SVG from Task 1 Step 3.

- [x] **Step 4: Regenerate the email PNG deterministically from the cleaned SVG**

Run from the hub's `nightly-src` directory so the existing Playwright dependency is used:

```bash
node --input-type=module <<'NODE'
import { readFile } from "node:fs/promises"
import { chromium } from "@playwright/test"

const source = "/home/ubuntu/.worktrees/vipercapture-subscriptions/static/vipercapture-mark.svg"
const output = "/home/ubuntu/.worktrees/vipercapture-subscriptions/static/vipercapture-email-mark.png"
const svg = await readFile(source, "utf8")
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 128, height: 128 } })
await page.setContent(`<style>html,body{margin:0}svg{display:block;width:128px;height:128px}</style>${svg}`)
await page.locator("svg").screenshot({ path: output, omitBackground: true })
await browser.close()
NODE
```

Expected: `static/vipercapture-email-mark.png` remains a 128-by-128 PNG and visually matches the cleaned SVG.

- [x] **Step 5: Run the production tests**

```bash
/home/ubuntu/screenshot-api/.venv/bin/python -m unittest test_site.py test_mail_service.py test_main.py -v
file static/vipercapture-email-mark.png
```

Expected: all tests PASS and `file` reports `PNG image data, 128 x 128`.

- [x] **Step 6: Build and run the container smoke check against the candidate**

```bash
docker build -t vipercapture:logo-fix-test .
bash test_container.sh vipercapture:logo-fix-test
```

Expected: `ViperCapture container smoke passed` and the temporary screenshot is removed by the script.

- [ ] **Step 7: Commit only when explicitly authorized**

```bash
git add test_site.py static/vipercapture-mark.svg static/vipercapture-email-mark.png
git commit -m "Fix ViperCapture logo artifact"
```

Push only to the private `Viperisuseful/vipercapture-production` repository's `production` branch, and only with explicit user authorization.

---

### Task 3: Responsive visual QA and handoff

**Files:**
- Inspect only: hub and ViperCapture rendered surfaces

**Interfaces:**
- Consumes: the locally rebuilt hub and ViperCapture assets.
- Produces: desktop/mobile and light/dark visual evidence plus a clean diff ready for authorized publication.

- [x] **Step 1: Start local candidates on loopback-only ports**

Run the hub from `nightly-src` on `127.0.0.1:5173`. Run ViperCapture in local mode on an unused loopback-only port after confirming it with `ss -lntp`; do not alter the production container or Nginx.

- [x] **Step 2: Verify the target flow with Playwright**

The flow under test is: homepage loads -> ViperCapture mark renders -> triangle is absent and cobalt artwork reaches the inner frame edge.

Check both sites at 1440-by-1000 desktop light and 390-by-844 mobile dark viewports. Confirm page identity, meaningful DOM content, no framework overlay, no relevant console errors, and visible triangle-free marks. Exercise the hub's compact navigation and ViperCapture's theme control, then confirm the resulting state.

- [x] **Step 3: Inspect diffs and repository state**

```bash
git diff --check
git status --short --branch
git diff --stat
```

Expected: only the approved asset, CSS, tests, generated hub build, design, and plan files are changed; no secrets or unrelated user work appear.

- [x] **Step 4: Stop only local candidate processes**

Stop the exact local test processes started in Step 1. Do not restart or modify the production services.

- [x] **Step 5: Report publication boundary**

Report local verification results and list the pending commit/push/deploy steps. Do not claim either live site changed unless the user separately authorizes publication and public verification succeeds.
