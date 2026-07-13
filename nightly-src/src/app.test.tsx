import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import App from "./App"

describe("Viper hub", () => {
  it("renders the approved hub message", () => {
    render(<App />)
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /everything viper builds & runs in one place/i,
      }),
    ).toBeInTheDocument()
  })
})
