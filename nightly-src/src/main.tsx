import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import "./index.css"
import { NotFound } from "./components/not-found.tsx"
import { ViperBlogIndex, ViperBlogPost } from "./components/viperblog-cli.tsx"
import { resolveSiteSurface } from "./lib/site-surface.ts"

const surface = resolveSiteSurface(window.location.pathname)
const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

if (surface === "not-found") {
  document.title = "404 | Signal lost"
  robots?.setAttribute("content", "noindex, nofollow")
  canonical?.remove()
}

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
