import { describe, expect, it } from "vitest"

import { privateSystems, publicProjects } from "./destinations"

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
})
