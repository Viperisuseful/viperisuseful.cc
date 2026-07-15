import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { privateSystems } from "@/data/destinations"
import { SystemsRail } from "./systems-rail"

describe("SystemsRail", () => {
  it("marks all private destinations as login required", () => {
    render(<SystemsRail />)
    privateSystems.forEach((system) => {
      const link = screen.getByRole("link", { name: new RegExp(system.name, "i") })
      expect(link).toHaveAttribute("href", system.href)
      expect(link).toHaveAttribute("rel", "noreferrer")
    })
    expect(screen.getAllByText("Login required")).toHaveLength(3)
  })

  it("does not repeat ViperCapture in the systems rail", () => {
    render(<SystemsRail />)

    expect(screen.queryByText("ViperCapture")).not.toBeInTheDocument()
    expect(screen.queryByText("Screenshot API")).not.toBeInTheDocument()
  })
})
