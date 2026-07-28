import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

const repositoryRoot = resolve(import.meta.dirname, "../..")

describe("crawler discovery files", () => {
  it("allows the public site and advertises its sitemap", async () => {
    const robots = await readFile(resolve(repositoryRoot, "robots.txt"), "utf8")

    expect(robots).toContain("User-agent: *")
    expect(robots).toContain("Allow: /")
    expect(robots).toContain("Sitemap: https://viperisuseful.cc/sitemap.xml")
    expect(robots).not.toContain("Disallow:")
  })

  it("lists only canonical, indexable pages", async () => {
    const sitemap = await readFile(resolve(repositoryRoot, "sitemap.xml"), "utf8")
    const postRegistry = await readFile(resolve(import.meta.dirname, "../src/data/blog-posts.ts"), "utf8")
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
    const postSlugs = [...postRegistry.matchAll(/^\s+slug: "([^"]+)",$/gm)].map((match) => match[1])

    expect(locations).toEqual([
      "https://viperisuseful.cc/",
      "https://viperisuseful.cc/blog/",
      ...postSlugs.map(
        (slug) => `https://viperisuseful.cc/blog/post.html?slug=${encodeURIComponent(slug)}`,
      ),
      "https://viperisuseful.cc/privacy/",
    ])
  })

  it("keeps the generated 404 document out of the index", async () => {
    const notFound = await readFile(resolve(repositoryRoot, "404.html"), "utf8")

    expect(notFound).toContain('<meta name="robots" content="noindex, nofollow"')
    expect(notFound).not.toContain('rel="canonical"')
  })
})
