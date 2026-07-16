import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { HeroLauncher } from "./hero-launcher"

describe("HeroLauncher", () => {
  it("uses the existing project logos in the floating field and showcase", () => {
    const { container } = render(<HeroLauncher />)

    expect(container.querySelectorAll('img[src="/marks/quickrunlab.png"]')).toHaveLength(2)
    expect(container.querySelectorAll('img[src="/marks/vipercapture.svg"]')).toHaveLength(2)
    expect(container.querySelectorAll('img[src="/marks/turtle-cave.png"]')).toHaveLength(1)
    expect(container.querySelector('img[src="/marks/github.svg"]')).toBeInTheDocument()
  })

  it("renders a real linked project stage beneath the hero", () => {
    render(<HeroLauncher />)
    expect(screen.getByTestId("hero-showcase")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /QuickRunLab/ })).toHaveAttribute(
      "href",
      "https://quickrunlab.viperisuseful.cc",
    )
  })
})
