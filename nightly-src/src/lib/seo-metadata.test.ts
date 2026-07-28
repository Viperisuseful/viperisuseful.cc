import { describe, expect, it } from "vitest"

import { resolveSeoMetadata } from "./seo-metadata"

const blogSlugs = new Set(["first-post", "second-post"])

describe("resolveSeoMetadata", () => {
  it.each([
    ["home", "", "https://viperisuseful.cc/"],
    ["blog", "", "https://viperisuseful.cc/blog/"],
    [
      "blog-post",
      "?slug=first-post",
      "https://viperisuseful.cc/blog/post.html?slug=first-post",
    ],
  ] as const)("returns the canonical URL for %s", (surface, search, canonical) => {
    expect(resolveSeoMetadata(surface, search, blogSlugs)).toEqual({
      canonical,
      robots: "index, follow",
    })
  })

  it.each([
    ["blog-post", ""],
    ["blog-post", "?slug=missing"],
    ["not-found", ""],
  ] as const)("keeps invalid or missing pages out of the index", (surface, search) => {
    expect(resolveSeoMetadata(surface, search, blogSlugs)).toEqual({
      canonical: null,
      robots: "noindex, nofollow",
    })
  })
})
