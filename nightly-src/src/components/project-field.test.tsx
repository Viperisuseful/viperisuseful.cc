import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { publicProjects } from "@/data/destinations"
import { ProjectField } from "./project-field"

describe("ProjectField", () => {
  it("renders every public project and keeps informational work unlinked", () => {
    render(<ProjectField />)
    publicProjects.forEach((project) => {
      expect(screen.getByRole("heading", { name: project.name })).toBeInTheDocument()
    })
    expect(screen.getByText("No public link")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /dulkirmod/i })).not.toBeInTheDocument()
  })

  it("renders the featured project logos without their old screenshots", () => {
    const { container } = render(<ProjectField />)

    expect(container.querySelector('img[src="/nightly/marks/quickrunlab.png"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/nightly/marks/turtle-cave.png"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/nightly/media/quickrunlab.webp"]')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/nightly/media/turtle-cave.webp"]')).not.toBeInTheDocument()
  })
})
