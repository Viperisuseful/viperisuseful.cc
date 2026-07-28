import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import "./index.css"
import { NotFound } from "./components/not-found.tsx"
import { ViperBlogIndex, ViperBlogPost } from "./components/viperblog-cli.tsx"
import { blogPosts } from "./data/blog-posts.ts"
import { resolveSeoMetadata } from "./lib/seo-metadata.ts"
import { resolveSiteSurface } from "./lib/site-surface.ts"

const surface = resolveSiteSurface(window.location.pathname)
const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
const metadata = resolveSeoMetadata(
  surface,
  window.location.search,
  new Set(blogPosts.map((post) => post.slug)),
)

robots?.setAttribute("content", metadata.robots)

if (metadata.canonical) {
  const canonical =
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
    document.head.appendChild(document.createElement("link"))
  canonical.rel = "canonical"
  canonical.href = metadata.canonical
} else {
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove()
}

if (surface === "not-found") document.title = "404 | Signal lost"
if (surface === "blog") document.title = "ViperBlog CLI | Field notes"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {surface === "home" ? (
      <App />
    ) : surface === "blog" ? (
      <ViperBlogIndex />
    ) : surface === "blog-post" ? (
      <ViperBlogPost />
    ) : (
      <NotFound />
    )}
  </StrictMode>,
)
