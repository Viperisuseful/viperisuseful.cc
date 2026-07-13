import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HeroLauncher } from "./hero-launcher"

describe("HeroLauncher", () => {
  it("uses project logos for QuickRunLab and Turtle Cave", () => {
    render(<HeroLauncher />)

    expect(screen.getByRole("img", { name: "QuickRunLab logo" })).toHaveAttribute(
      "src",
      "/marks/quickrunlab.png",
    )
    expect(screen.getByRole("img", { name: "Turtle Cave logo" })).toHaveAttribute(
      "src",
      "/marks/turtle-cave.png",
    )
  })

  it("renders the approved signal artwork", () => {
    render(<HeroLauncher />)
    expect(screen.getByTestId("hero-art-signal")).toBeInTheDocument()
    expect(screen.getByTestId("launcher-brand")).toHaveAttribute(
      "data-hero-variant",
      "signal",
    )
  })
})
