import { describe, expect, it } from "vitest"

import css from "./index.css?raw"

describe("ViperCode CLI palette", () => {
  it("uses the dark terminal system palette", () => {
    expect(css).toContain("--background: oklch(0.105 0.004 255)")
    expect(css).toContain("--primary: oklch(0.72 0.14 42)")
    expect(css).toContain("background-size: auto, 32px 32px, 32px 32px, auto")
    expect(css).not.toContain("viper-theme")
  })
})
