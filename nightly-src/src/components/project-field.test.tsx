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
})
