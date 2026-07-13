import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NotFound } from "./not-found"

describe("NotFound", () => {
  it("renders the approved lost-signal recovery actions", () => {
    render(<NotFound />)

    expect(screen.getByRole("heading", { level: 1, name: "Signal lost." })).toBeInTheDocument()
    expect(screen.getByText("404")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute(
      "href",
      "/#projects",
    )
  })
})
