import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HeroArt } from "./hero-art"

describe("HeroArt", () => {
  it.each(["monogram", "signal"] as const)("renders the %s artwork", (variant) => {
    render(<HeroArt variant={variant} />)
    expect(screen.getByTestId(`hero-art-${variant}`)).toBeInTheDocument()
  })

  it("keeps the original artwork on the base route", () => {
    render(<HeroArt variant="original" />)
    expect(screen.getByRole("img", { name: "Viper is useful" })).toHaveAttribute(
      "src",
      "/nightly/marks/viper.webp",
    )
  })

  it("renders the local illustration without spoken duplicate content", () => {
    render(<HeroArt variant="illustration" />)
    const image = screen.getByTestId("hero-art-illustration")
    expect(image).toHaveAttribute("src", "/nightly/marks/viper-snake-terminal.webp")
    expect(image).toHaveAttribute("alt", "")
  })
})
