# Design System

## Direction

Personal operating system. The interface behaves like a fast, visual launcher
for one developer's products and infrastructure. It uses real project surfaces,
direct language, dense interaction where useful, and generous space around the
primary choices.

## Theme

System-aware light and dark themes using semantic OKLCH tokens. Dark mode feels
like a dim developer workspace. Light mode feels like a clean hardware manual,
not cream paper. Theme is set once at the application root.

### Color

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `oklch(0.975 0.006 150)` | `oklch(0.145 0.018 155)` | Page canvas |
| `--foreground` | `oklch(0.19 0.018 155)` | `oklch(0.94 0.008 150)` | Primary text |
| `--surface` | `oklch(0.945 0.012 150)` | `oklch(0.205 0.022 155)` | Raised content |
| `--surface-strong` | `oklch(0.90 0.02 145)` | `oklch(0.27 0.028 155)` | Interactive surface |
| `--muted` | `oklch(0.47 0.025 155)` | `oklch(0.71 0.024 150)` | Secondary text |
| `--border` | `oklch(0.82 0.02 150)` | `oklch(0.32 0.026 155)` | Dividers and focus structure |
| `--primary` | `oklch(0.79 0.19 128)` | `oklch(0.84 0.20 128)` | Single lime accent |
| `--primary-foreground` | `oklch(0.16 0.035 145)` | `oklch(0.16 0.035 145)` | Text on accent |

Project artwork may retain its own colors inside screenshots and logos. UI
chrome uses only the semantic palette above.

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

