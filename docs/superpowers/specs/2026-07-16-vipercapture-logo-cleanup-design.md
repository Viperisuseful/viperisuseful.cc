# ViperCapture logo cleanup design

## Goal

Remove the translucent lower-right triangle from the ViperCapture mark everywhere and make the featured hub tile use the available framed area edge-to-edge.

## Scope

- Remove the decorative triangle path from the hub source SVG at `nightly-src/public/marks/vipercapture.svg`; the hub build republishes it to `marks/vipercapture.svg`.
- Remove the same path from ViperCapture's production SVG at `static/vipercapture-mark.svg`.
- Regenerate ViperCapture's email PNG from the cleaned SVG so mailed branding stays consistent.
- Size only the ViperCapture mark in the hub showcase to fill the content area inside its existing one-pixel border.

## Visual behavior

The cobalt rounded square and white interlocking capture outlines remain unchanged. The gray/translucent corner disappears. On the hub, the cobalt square reaches the inner edge of the existing rounded border at desktop and mobile sizes. The border, corner radius, card layout, labels, and other project marks remain unchanged.

ViperCapture continues to use the same cleaned SVG in its header, footer, login, dashboard, documentation, pricing, and legal surfaces. The email attachment uses an equivalent cleaned raster mark.

## Verification

- Assert that neither SVG contains the removed decorative path.
- Confirm the hub's ViperCapture-specific image sizing does not affect QuickRunLab or other marks.
- Run the hub lint, unit, build, and Playwright suites.
- Run ViperCapture's relevant unit and container/static checks.
- Render both applications at desktop and mobile sizes in light and dark themes and inspect the logo boundary.

## Deployment and rollback

No routing, environment, database, authentication, billing, or storage changes are required. The hub publishes from `main`; ViperCapture publishes from the private production repository's `production` branch. Rollback is a normal revert to the preceding asset/CSS revisions. No force push or infrastructure change is needed.
