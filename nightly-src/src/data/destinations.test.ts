import { describe, expect, it } from "vitest"

import { moreProjects, privateSystems, publicProjects, systemDestinations } from "./destinations"

describe("destination registry", () => {
  it("uses unique ids and HTTPS links", () => {
    const all = [...publicProjects, ...privateSystems]
    expect(new Set(all.map((item) => item.id)).size).toBe(all.length)
    expect(
      all.filter((item) => item.href).every((item) => item.href!.startsWith("https://")),
    ).toBe(true)
  })

  it("marks every private system as login required", () => {
    expect(privateSystems.map((item) => item.access)).toEqual(["login", "login", "login"])
  })

  it("uses logos instead of screenshots for QuickRunLab and Turtle Cave", () => {
    const quickrunlab = publicProjects.find((item) => item.id === "quickrunlab")
    const turtle = publicProjects.find((item) => item.id === "turtle-cave")

    expect(quickrunlab?.mark).toBe("/marks/quickrunlab.png")
    expect(quickrunlab).not.toHaveProperty("image")
    expect(turtle?.mark).toBe("/marks/turtle-cave.png")
    expect(turtle).not.toHaveProperty("image")
  })

  it("features canonical ViperCapture branding in More works instead of systems", () => {
    expect(moreProjects[0]).toMatchObject({
      id: "vipercapture",
      name: "ViperCapture",
      href: "https://capture.viperisuseful.cc",
      mark: "/marks/vipercapture.svg",
    })
    expect(systemDestinations.some((item) => item.id === "vipercapture" || item.id === "scp")).toBe(
      false,
    )
    expect(publicProjects.some((item) => item.href === "https://scp.viperisuseful.cc")).toBe(false)
  })
})
