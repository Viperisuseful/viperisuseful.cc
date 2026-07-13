# Design System

## Direction

Personal operating system. The interface behaves like a fast, visual launcher
for one developer's products and infrastructure. It uses real project surfaces,
direct language, dense interaction where useful, and generous space around the
primary choices.

## Theme

System-aware light and dark themes using semantic OKLCH tokens. OpenCode's
crisp rule structure supplies the restraint; Claude's warm canvas and
terracotta supply the human tone. Dark mode uses espresso-charcoal rather than
green-black. Theme is set once at the application root.

### Color

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `oklch(0.98 0.008 85)` | `oklch(0.14 0.009 55)` | Page canvas |
| `--foreground` | `oklch(0.18 0.007 60)` | `oklch(0.93 0.008 82)` | Primary text |
| `--surface` | `oklch(0.955 0.010 82)` | `oklch(0.19 0.010 55)` | Raised content |
| `--surface-strong` | `oklch(0.90 0.014 80)` | `oklch(0.25 0.013 55)` | Interactive surface |
| `--muted` | `oklch(0.42 0.014 70)` | `oklch(0.72 0.012 78)` | Secondary text |
| `--border` | `oklch(0.84 0.012 80)` | `oklch(0.31 0.013 58)` | Dividers and focus structure |
| `--primary` | `oklch(0.55 0.145 39)` | `oklch(0.72 0.125 39)` | Terracotta accent |
| `--primary-foreground` | `oklch(0.98 0.008 85)` | `oklch(0.15 0.010 55)` | Text on accent |

Project artwork may retain its own colors inside screenshots and logos. UI
chrome uses only warm ink, terracotta, and the semantic neutrals above.

## Typography

- Display and body: Bricolage Grotesque Variable, self-hosted through Fontsource.
- Technical metadata: JetBrains Mono Variable, self-hosted through Fontsource.
- Display tracking never tighter than `-0.035em`.
- Headline ceiling is `clamp(3.2rem, 7vw, 6rem)` with balanced wrapping.
- Body copy stays between 16px and 19px with a maximum line length of 68ch.

The display family feels assembled and tactile, matching the cut-paper Viper
mark without repeating the old editorial serif treatment.

## Shape

- Content surfaces: 14px radius.
- Compact controls and image frames: 10px radius.
- Buttons and tags: full pill.
- Focus rings: 3px outer ring in `--primary` with a 2px canvas offset.

## Layout

- Maximum content width: 1440px.
- Desktop uses an asymmetric 12-column grid.
- Tablet collapses project compositions to two columns.
- Below 768px every section becomes one strict column with 16px gutters.
- Navigation stays below 72px and on one desktop line.
- Hero uses `min-height: 100dvh`, never `h-screen`.

## Components

Use customized shadcn source components with Radix primitives:

- `Button` for primary actions and external destinations.
- `Badge` for truthful access labels such as `Login required`.
- `Sheet` for mobile navigation, always with an accessible title.
- `Separator` for structural grouping.
- `Tooltip` only for icon-only controls.
- `Skeleton` for project imagery while assets load.

Phosphor supplies one icon family at a consistent 1.5 stroke weight. Icons
inside buttons use component sizing and `data-icon` placement.

## Motion

- Initial launcher composition enters once in a short ordered sequence.
- Project imagery shifts subtly on pointer hover to clarify interactivity.
- Buttons compress to `scale(0.98)` on press.
- Intersection Observer activates a limited set of section reveals.
- No global scroll listener, cursor replacement, continuous background loop, or
  hidden-until-JavaScript content.
- `prefers-reduced-motion` removes transforms and uses instant state changes.

## Imagery

Real screenshots lead project storytelling. Each image uses fixed dimensions,
responsive crops, descriptive alt text, and local optimized files. The fresh
Turtle Cave capture waits 12 seconds before capture so its typed hero content
is complete. Private systems use official product marks, not fake dashboards.

## Copy

Voice is direct, first-person, and specific. Avoid startup claims, fake metrics,
section numbering, decorative status language, and em dashes. Button labels use
one consistent intent: `Open project`, `Sign in`, or `View source`.
