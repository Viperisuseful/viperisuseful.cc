import { describe, expect, it } from "vitest"

import css from "./index.css?raw"

describe("site palette", () => {
  it("uses the restrained near-black and near-white system palette", () => {
    expect(css).toContain("--background: oklch(0.985 0.002 250)")
    expect(css).toContain("--background: oklch(0.13 0.005 270)")
    expect(css).toContain("background-size: 48px 48px")
    expect(css).not.toContain("viper-theme")
  })
})
