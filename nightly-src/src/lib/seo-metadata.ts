import type { SiteSurface } from "./site-surface"

const siteOrigin = "https://viperisuseful.cc"

export type SeoMetadata = {
  canonical: string | null
  robots: "index, follow" | "noindex, nofollow"
}

export function resolveSeoMetadata(
  surface: SiteSurface,
  search: string,
  blogSlugs: ReadonlySet<string>,
): SeoMetadata {
  if (surface === "home") {
    return { canonical: `${siteOrigin}/`, robots: "index, follow" }
  }

  if (surface === "blog") {
    return { canonical: `${siteOrigin}/blog/`, robots: "index, follow" }
  }

  if (surface === "blog-post") {
    const slug = new URLSearchParams(search).get("slug")
    if (slug && blogSlugs.has(slug)) {
      return {
        canonical: `${siteOrigin}/blog/post.html?slug=${encodeURIComponent(slug)}`,
        robots: "index, follow",
      }
    }
  }

  return { canonical: null, robots: "noindex, nofollow" }
}
