import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HeroArt } from "./hero-art"

describe("HeroArt", () => {
  it("renders only the approved signal artwork", () => {
    render(<HeroArt />)
    expect(screen.getByTestId("hero-art-signal")).toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
