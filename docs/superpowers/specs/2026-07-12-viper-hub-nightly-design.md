# Viper Hub Nightly Design

## Goal

Build a complete preview overhaul of `viperisuseful.cc` at `/nightly/`. The
preview becomes a polished hub for Viper's public projects and login-protected
systems while leaving the existing root homepage unchanged until explicit
promotion approval.

## Audience and job

Visitors, friends, collaborators, and returning users need to understand what
Viper builds, distinguish public destinations from private systems, and open the
right destination quickly. The interface should feel like Viper's personal
operating system rather than a conventional portfolio.

## Information architecture

The page has five primary regions:

1. A compact sticky navigation with Viper mark, Projects, Systems, About,
   GitHub, and theme control.
2. An asymmetric split hero with the statement "Everything Viper runs, in one
   place." and an interactive launcher made from real project marks and images.
3. A project field featuring QuickRunLab and Turtle Cave as the largest visual
   destinations, followed by ViperSearch, Screenshot API, ViperCode,
   ViperProxy, and DulkirMod.
4. A quieter private-systems rail for Coolify, Vaultwarden, and CDN. Each item
   clearly states `Login required` without exposing credentials or operational
   detail.
5. An About and Presence region using the existing Lanyard integration plus
   direct GitHub, Discord, Modrinth, blog, email, and privacy links.

The hero contains no metrics, trust strip, scroll cue, or decorative terminal.
Its supporting line is: "Projects, tools, communities, and private systems built
and hosted by one very online developer."

## Project destinations

| Label | Destination | Access |
| --- | --- | --- |
| QuickRunLab | `https://quickrunlab.viperisuseful.cc` | Public redirect |
| Turtle Cave | `https://turtle.viperisuseful.cc` | Public redirect |
| ViperSearch | `https://search.viperisuseful.cc` | Public |
| Screenshot API | `https://scp.viperisuseful.cc` | Public |
| ViperCode | `https://github.com/Viperisuseful/ViperCode` | Public source/releases |
| ViperProxy | `https://modrinth.com/mod/viperproxy` | Public |
| DulkirMod Port | No public destination currently | Informational only |
| Coolify | `https://coolify.viperisuseful.cc` | Login required |
| Vaultwarden | `https://vault.viperisuseful.cc` | Login required |
| CDN | `https://cdn.viperisuseful.cc` | Login required |

## Visual composition

The layout follows the tokens and rules in `DESIGN.md`. Bricolage Grotesque
carries display and body copy, with JetBrains Mono limited to technical
metadata. A single lime accent evolves the existing green identity. Light and
dark themes use cool green-tinted neutrals and semantic OKLCH tokens.

Project imagery forms an asymmetric 12-column composition. QuickRunLab is a
wide landscape tile. Turtle Cave is a taller tile using a fresh SCP capture
from `turtlecave.xyz` at a 1600px viewport with a 12-second wait. Smaller
projects use real logos, screenshots, or repository artwork. Private systems
use a compact horizontal rail rather than repeating the project tile pattern.

Surfaces use a 14px radius, image frames and compact controls use 10px, and
buttons use pills. Borders and shadows are not paired decoratively. UI chrome
never competes with project artwork.

## Interaction and states

- Hero launcher items enter in a short sequence to establish hierarchy.
- Hover and focus shift project images a few pixels and reveal one clear action.
- Mobile navigation uses a shadcn `Sheet` with an accessible title.
- Theme defaults to system preference and persists a manual choice.
- Images render matching shadcn `Skeleton` fallbacks while loading.
- Failed project images reveal a text fallback and keep destination links usable.
- Presence failure shows a neutral unavailable message without blocking content.
- All interactive targets support keyboard input and visible focus.
- Reduced motion removes transforms and sequences.

## Technical architecture

Add a Vite React TypeScript application under `nightly-src/`. Use Tailwind CSS
v4, customized shadcn source components, Radix primitives, Motion for isolated
client interaction, Phosphor icons, and locally bundled variable fonts. Build
with base path `/nightly/` and output committed static files to `nightly/` so
the existing GitHub Pages deployment serves the preview without changing the
root site.

Keep project data in one typed module. Keep visual sections in focused
components. Keep motion in isolated leaf components. No app needs a backend.
The existing Lanyard API remains the only runtime data dependency.

The preview includes canonical metadata for `/nightly/` and a `noindex` robots
directive until promotion. Existing root SEO, blog, privacy page, redirects,
and Omnisend behavior stay unchanged.

## Redirect architecture

Create Cloudflare-proxied DNS records for `turtle.viperisuseful.cc` and
`quickrunlab.viperisuseful.cc` pointing to this VM. Host Nginx remains the
public origin and serves only permanent redirects:

- `turtle.viperisuseful.cc/*` returns `301` to
  `https://turtlecave.xyz$request_uri`.
- `quickrunlab.viperisuseful.cc/*` returns `301` to
  `https://quickrunlab.tech$request_uri`.

Issue certificates before enabling Cloudflare proxying, validate redirect path
and query preservation, and do not alter existing Turtle Cave or QuickRunLab
origin routes.

## Accessibility and performance

- WCAG 2.2 AA contrast and focus visibility.
- Semantic landmarks and heading order.
- Minimum 44px touch targets.
- No content hidden behind pointer-only interaction.
- `prefers-reduced-motion` support for every animated element.
- Responsive checks at 375px, 768px, 1024px, and 1440px.
- Local optimized images with explicit dimensions and lazy loading below fold.
- Target LCP below 2.5 seconds, CLS below 0.1, and INP below 200ms.

## Testing and acceptance

1. TypeScript, ESLint, production build, and automated component tests pass.
2. `/nightly/` loads directly and after refresh on GitHub Pages.
3. Desktop and mobile screenshots match the approved personal-OS direction in
   both themes.
4. Keyboard traversal reaches every destination in logical order.
5. Reduced-motion mode removes nonessential transform animation.
6. All public and private links resolve to their intended host.
7. Both new subdomains return permanent redirects and preserve paths/queries.
8. Existing `/`, `/blog/`, `/privacy/`, and social redirect pages remain
   byte-for-byte unchanged unless build metadata requires an explicit change.
9. Lighthouse meets accessibility and best-practice targets and has no critical
   performance regression.

## Rollback

Removing `nightly/`, `nightly-src/`, and the two new redirect virtual hosts
fully removes the preview and aliases. Root GitHub Pages content, current
domains, and application containers remain untouched. DNS and Nginx snapshots
must exist before subdomain activation.
