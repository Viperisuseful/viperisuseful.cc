import { describe, expect, it } from "vitest"

import { resolveSiteSurface } from "./site-surface"

describe("resolveSiteSurface", () => {
  it.each([
    ["/", "home"],
    ["/index.html", "home"],
    ["/nightly", "not-found"],
    ["/nightly/", "not-found"],
    ["/nightly/2/", "not-found"],
    ["/missing-page", "not-found"],
  ] as const)("maps %s to %s", (pathname, expected) => {
    expect(resolveSiteSurface(pathname)).toBe(expected)
  })
})
