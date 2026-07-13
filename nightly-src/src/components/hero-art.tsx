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
      <div
        className="hero-art hero-art--signal"
        data-testid="hero-art-signal"
        aria-hidden="true"
      >
        <span className="hero-art__signal-core">V</span>
      </div>
    )
  }

  return (
    <div
      className="hero-art hero-art--monogram"
      data-testid="hero-art-monogram"
      aria-hidden="true"
    >
      <span className="hero-art__monogram">V</span>
      <span className="hero-art__signature">viperisuseful</span>
    </div>
  )
}
