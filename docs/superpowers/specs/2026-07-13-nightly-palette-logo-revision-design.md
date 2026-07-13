# Nightly palette and logo revision

## Goal

Revise the approved `/nightly/` hub so its interface feels closer to the calm,
high-contrast restraint of OpenCode and the warm human tone of Claude. Remove
the QuickRunLab and Turtle Cave screenshots from every hub placement and use
their real local brand marks instead.

The main `viperisuseful.cc` homepage remains unchanged. This revision affects
only the nightly source and its generated `/nightly/` output.

## Design direction

The page keeps its current asymmetric personal-operating-system composition,
typography, spacing, project hierarchy, motion, and light/dark theme control.
The visual change combines:

- OpenCode's crisp near-white, near-black, and quiet rule structure.
- Claude's warm off-white canvas and restrained terracotta brand accent.
- Viper's existing cut-paper wordmark and direct project-launcher behavior.

This is inspiration, not a clone. The result must still read as Viper's hub.

## Color strategy

Use a restrained interface palette with one committed terracotta moment in the
hero. Terracotta owns the primary CTA, focus treatment, Viper tile, and selected
small accents. It does not color every card or divider. Project logos may retain
their own brand colors as artwork.

### Light tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `--background` | `oklch(0.98 0.008 85)` | Warm near-white canvas |
| `--foreground` | `oklch(0.18 0.007 60)` | Near-black ink |
| `--card` | `oklch(0.955 0.010 82)` | Quiet raised surface |
| `--popover` | `oklch(0.98 0.008 85)` | Overlay canvas |
| `--primary` | `oklch(0.61 0.145 39)` | Terracotta action/brand accent |
| `--primary-foreground` | `oklch(0.98 0.008 85)` | Text on terracotta |
| `--secondary` | `oklch(0.92 0.012 82)` | Secondary controls |
| `--muted` | `oklch(0.945 0.010 82)` | Muted surface |
| `--muted-foreground` | `oklch(0.42 0.014 70)` | Secondary copy |
| `--border` | `oklch(0.84 0.012 80)` | Rules and structure |
| `--ring` | `oklch(0.56 0.145 39)` | Focus indication |
| `--surface-strong` | `oklch(0.90 0.014 80)` | Strong neutral stage |
| `--wash` | `oklch(0.91 0.035 45)` | Terracotta hero atmosphere |

### Dark tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `--background` | `oklch(0.14 0.009 55)` | Espresso-charcoal canvas |
| `--foreground` | `oklch(0.93 0.008 82)` | Warm light ink |
| `--card` | `oklch(0.19 0.010 55)` | Raised dark surface |
| `--popover` | `oklch(0.19 0.010 55)` | Dark overlay surface |
| `--primary` | `oklch(0.72 0.125 39)` | Softer dark-mode terracotta |
| `--primary-foreground` | `oklch(0.15 0.010 55)` | Dark text on accent |
| `--secondary` | `oklch(0.25 0.012 55)` | Secondary controls |
| `--muted` | `oklch(0.25 0.012 55)` | Muted surface |
| `--muted-foreground` | `oklch(0.72 0.012 78)` | Secondary copy |
| `--border` | `oklch(0.31 0.013 58)` | Rules and structure |
| `--ring` | `oklch(0.72 0.125 39)` | Focus indication |
| `--surface-strong` | `oklch(0.25 0.013 55)` | Strong dark stage |
| `--wash` | `oklch(0.23 0.040 35)` | Terracotta hero atmosphere |

All shadcn semantic tokens and chart placeholders must be remapped to this hue
family. No lime UI token remains. Turtle Cave's green artwork is allowed
because it belongs to the logo, not the interface chrome.

## QuickRunLab logo treatment

Use `/home/ubuntu/quickrunlab/static/app-logo.png` as the source of truth.
Copy it into the nightly source under `public/marks/quickrunlab.png`.

- Hero launcher: show the logo as the complete visual inside the existing
  QuickRunLab launcher tile. Keep the project name as the accessible/visible
  label, but remove the terminal screenshot entirely.
- Project field: replace the screenshot region with a centered brand stage.
  The logo may render larger than generic project marks because it includes a
  full wordmark. Preserve its square aspect ratio and do not crop it.
- The logo's own near-black background remains intact in both themes.

## Turtle Cave logo treatment

Use `/home/ubuntu/turtle-dashboard/public/img/favicon-turtle.png` as the source
of truth. Copy it into the nightly source under
`public/marks/turtle-cave.png`.

- Hero launcher: center the turtle mark on a quiet neutral stage; its natural
  green is the only green allowed in the interface.
- Project field: replace the screenshot region with a larger centered turtle
  mark and ample surrounding space.
- Do not recolor, trace, redraw, or upscale the source file destructively.
  Browser scaling must remain crisp enough at the chosen display size.

## Data and component changes

- QuickRunLab and Turtle Cave destination records use `mark`, not `image`.
- The hero launcher items use logo metadata rather than screenshot metadata.
- Existing `ProjectVisual` mark behavior is extended through project-specific
  CSS selectors; no new generic card component is required.
- Remove the unused `quickrunlab.webp` and `turtle-cave.webp` assets from both
  source and generated output after references are gone.
- ViperSearch and Screenshot API retain their current screenshots.

## Accessibility

- Body and secondary text retain WCAG AA contrast in both themes.
- Primary button text reaches at least 4.5:1 against terracotta.
- Focus rings remain visible against canvas, card, and logo stages.
- Logo images receive truthful alt text in the hero. Decorative repeats in
  project cards remain hidden from assistive technology because the card title
  already names the project.
- Existing keyboard, reduced-motion, touch-target, and mobile behavior remain.

## Verification

Before publication:

1. Run unit tests, TypeScript build, oxlint, dependency audit, and the complete
   Playwright desktop/mobile/reduced-motion matrix.
2. Capture light and dark desktop/mobile screenshots and inspect them.
3. Run axe and require zero serious or critical violations.
4. Confirm no horizontal overflow or broken images.
5. Search nightly source/output for old screenshot references and the old lime
   token family.
6. Confirm the root homepage and its existing subdirectories are unchanged.
7. Publish only `/nightly/`, then verify the live page and both redirect links.

## Rollback

Revert the palette/logo revision commit and regenerate `nightly/`. The existing
published nightly build remains the last known-good visual fallback until the
new live verification passes.
