# ViperCapture Featured Swap Design

## Goal

Emphasize ViperCapture on the public hub by placing it in the second featured-project slot and moving Turtle Cave to the first `More works` slot.

## Chosen design

Use a literal data-only placement swap. Keep the existing two-card featured layout, compact project directory, descriptions, marks, URLs, actions, tags, headings, and responsive styling unchanged. `featuredProjects` becomes QuickRunLab followed by ViperCapture. `moreProjects` becomes Turtle Cave followed by ViperCode, ViperProxy, and DulkirMod Port.

This is the smallest change that satisfies the requested emphasis and avoids an unrequested copy or layout redesign. The destination registry remains the single source of truth; tests assert both arrays explicitly so a future reorder cannot silently undo the prominence decision.

## Verification

Run unit tests, lint, the production build, and Playwright. Verify the generated homepage and shared 404 in light and dark modes, then verify the Journal index and a real post because the hub build republishes shared assets. Do not push or publish without separate authorization.
