# Nightly Hero Alternatives Design

## Goal

Replace the central torn-paper `VIPER isuseful` tile in the nightly hero with
three stronger visual directions. Publish all three as phone-friendly previews
so the user can choose by visiting `/nightly/1`, `/nightly/2`, and
`/nightly/3`.

## Scope

- Keep `/nightly` unchanged while the alternatives are being evaluated.
- Keep the existing copy, navigation, project cards, links, palette, typography,
  dark mode, and page sections unchanged.
- Change only the central hero artwork and the minimum routing logic needed to
  select it.
- Do not change Nginx, Cloudflare, Coolify, DNS, or any application outside the
  static `viperisuseful.cc` repository.

## Design Read

This is a targeted evolution of a developer portfolio for friends, users, and
potential collaborators. The visual language stays warm, direct, and playful,
with OpenCode-like restraint and a Claude-like human tone.

- Design variance: 7
- Motion intensity: 4
- Visual density: 3
- Foundation: the existing React, Tailwind, shadcn, Motion, and semantic CSS
  token system

## Shared Composition

All three routes retain the current asymmetric launcher composition:

- QuickRunLab remains the top-right linked card.
- Turtle Cave remains the lower-left linked card.
- The small `VS` and `SCP` orbit labels remain decorative.
- The central artwork occupies the existing `.launcher-brand` footprint.
- Entry motion remains a single scale-and-fade used to establish hierarchy.
- Reduced-motion users receive the static composition.

The central artwork is decorative because the adjacent hero heading already
provides the page identity. It must not add a focus stop or duplicate spoken
content.

## Alternative 1: Monogram Plaque

Route: `/nightly/1`

The central tile becomes a clean terracotta plaque built around an oversized
`V`. A restrained inset ring and a small `viperisuseful` signature give it the
feel of a deliberate brand stamp instead of a pasted logo.

This is the recommended direction. It is the clearest at phone size, has no
image dependency, and should age better than illustrative artwork.

## Alternative 2: Signal Field

Route: `/nightly/2`

The central tile becomes an abstract signal field. A compact `V` sits at the
center of several low-contrast concentric rings, with one terracotta sweep that
visually connects the core to the surrounding project cards.

The artwork uses CSS backgrounds and borders, not a hand-drawn SVG. Motion is
limited to a subtle one-time entrance. There is no perpetual rotation or pulse.

## Alternative 3: Snake Terminal Illustration

Route: `/nightly/3`

The central tile uses an original locally stored raster illustration: a simple
hand-drawn snake curling into a `V` around a terminal cursor. The artwork uses
only warm off-white, ink, and terracotta so it remains part of the existing
palette.

The image contains no generated words. It is cropped with `object-fit: cover`,
has fixed intrinsic dimensions to prevent layout shift, and is bundled with the
site rather than loaded from an external host.

## Routing

The application reads the normalized pathname once:

- `/nightly/1` and `/nightly/1/` select alternative 1.
- `/nightly/2` and `/nightly/2/` select alternative 2.
- `/nightly/3` and `/nightly/3/` select alternative 3.
- Every other `/nightly` path keeps the existing central artwork.

No separate React applications or duplicated page trees are created. A small
variant selector feeds one hero-art component, keeping all content and behavior
identical across the previews.

## Responsive Behavior

- Desktop keeps the current launcher geometry.
- Mobile keeps the current card positions but guarantees that each central
  artwork remains recognizable behind the linked cards.
- The monogram and signal core scale with `clamp()` rather than fixed oversized
  text.
- The illustration reserves its aspect ratio before loading.
- No horizontal overflow is allowed at 390 CSS pixels.

## Accessibility and Performance

- The preview artwork is `aria-hidden="true"` and introduces no focusable UI.
- Existing link labels, heading hierarchy, theme control, and keyboard behavior
  remain unchanged.
- Light and dark variants must pass WCAG 2 AA automated checks.
- Alternative 3 is optimized to WebP before commit.
- No new runtime dependency is added.

## Verification

1. Unit tests prove pathname normalization and variant selection.
2. Component tests prove each route renders the intended art variant and that
   base `/nightly` retains the current artwork.
3. The production build succeeds with no stale asset references.
4. Existing unit, lint, audit, and Playwright suites remain green.
5. Playwright captures desktop and 390-pixel mobile screenshots for all three
   routes in light and dark themes.
6. Live checks confirm status 200, no console errors, no broken images, no
   overflow, and working theme controls.

## Deployment and Rollback

The tested change is published to the repository's production `main` branch,
which triggers the existing deployment. Verification must continue until the
new asset hashes are live.

Rollback is a fast-forward revert of the published hero-options commit to the
previous known-good tree at commit `90fade058fe54977b4a624ac239bbe7d14b52845`.
No infrastructure rollback is required because routing remains inside the
static application.
