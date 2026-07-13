import { describe, expect, it } from "vitest"

import css from "./index.css?raw"

describe("nightly palette", () => {
  it("uses the approved terracotta palette and removes lime UI tokens", () => {
    expect(css).toContain("--background: oklch(0.98 0.008 85)")
    expect(css).toContain("--primary: oklch(0.55 0.145 39)")
    expect(css).toContain("--primary: oklch(0.72 0.125 39)")
    expect(css).not.toContain("oklch(0.79 0.19 128)")
    expect(css).not.toContain("oklch(0.84 0.20 128)")
  })
})
