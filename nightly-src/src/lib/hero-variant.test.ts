import { describe, expect, it } from "vitest"

import { resolveHeroVariant } from "./hero-variant"

describe("resolveHeroVariant", () => {
  it.each([
    ["/nightly/1", "monogram"],
    ["/nightly/1/", "monogram"],
    ["/nightly/2", "signal"],
    ["/nightly/2/", "signal"],
    ["/nightly/3", "illustration"],
    ["/nightly/3/", "illustration"],
    ["/nightly", "original"],
    ["/nightly/", "original"],
    ["/nightly/unknown", "original"],
  ] as const)("maps %s to %s", (pathname, expected) => {
    expect(resolveHeroVariant(pathname)).toBe(expected)
  })
})
