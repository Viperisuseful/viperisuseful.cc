export type SiteSurface = "home" | "not-found"

export function resolveSiteSurface(pathname: string): SiteSurface {
  return pathname === "/" || pathname === "/index.html" ? "home" : "not-found"
}
