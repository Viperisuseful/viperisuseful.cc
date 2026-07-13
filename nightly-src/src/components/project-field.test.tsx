import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { featuredProjects, moreProjects } from "@/data/destinations"
import { ProjectField } from "./project-field"

describe("ProjectField", () => {
  it("renders every public project and keeps informational work unlinked", () => {
    render(<ProjectField />)
    featuredProjects.forEach((project) => {
      expect(screen.getByRole("heading", { name: project.name })).toBeInTheDocument()
    })
    moreProjects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
    expect(screen.getByText("No public link")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /dulkirmod/i })).not.toBeInTheDocument()
  })

  it("renders the featured project logos without their old screenshots", () => {
    const { container } = render(<ProjectField />)

    expect(container.querySelector('img[src="/marks/quickrunlab.png"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/marks/turtle-cave.png"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/media/quickrunlab.webp"]')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/media/turtle-cave.webp"]')).not.toBeInTheDocument()
  })
})
