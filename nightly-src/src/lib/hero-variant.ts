export type HeroVariant = "original" | "monogram" | "signal" | "illustration"

export function resolveHeroVariant(pathname: string): HeroVariant {
  const normalized = `/${pathname.split("/").filter(Boolean).join("/")}`

  if (normalized === "/nightly/1") return "monogram"
  if (normalized === "/nightly/2") return "signal"
  if (normalized === "/nightly/3") return "illustration"
  return "original"
}
