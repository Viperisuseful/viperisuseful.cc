import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { moreProjects } from "@/data/destinations"
import { ProjectField } from "./project-field"

describe("ProjectField", () => {
  it("renders the smaller project directory and keeps informational work unlinked", () => {
    render(<ProjectField />)
    moreProjects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
    expect(screen.getByText("No public link")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /dulkirmod/i })).not.toBeInTheDocument()
  })

  it("does not repeat the featured QuickRunLab and Turtle Cave cards", () => {
    const { container } = render(<ProjectField />)

    expect(screen.queryByText("QuickRunLab")).not.toBeInTheDocument()
    expect(screen.queryByText("Turtle Cave")).not.toBeInTheDocument()
    expect(container.querySelector(".project-story")).not.toBeInTheDocument()
  })

  it("leads More works with the canonical ViperCapture destination", () => {
    const { container } = render(<ProjectField />)

    expect(screen.getByRole("heading", { name: "More works" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /ViperCapture/ })).toHaveAttribute(
      "href",
      "https://capture.viperisuseful.cc",
    )
    expect(container.querySelector(".project-directory__item img")).toHaveAttribute(
      "src",
      "/marks/vipercapture.svg",
    )
  })
})
