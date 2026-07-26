export type SiteSurface = "home" | "blog" | "blog-post" | "not-found"

export function resolveSiteSurface(pathname: string): SiteSurface {
  if (pathname === "/" || pathname === "/index.html") return "home"
  if (pathname === "/blog" || pathname === "/blog/" || pathname === "/blog/index.html") return "blog"
  if (pathname === "/blog/post.html") return "blog-post"
  return "not-found"
}
