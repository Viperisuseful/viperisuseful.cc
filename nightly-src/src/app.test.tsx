import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import App from "./App"

describe("Viper hub", () => {
  it("renders the ViperCode CLI and executes commands", async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole("region", { name: "ViperCode CLI portfolio" })).toBeInTheDocument()
    expect(screen.getByText("ViperCode CLI")).toBeInTheDocument()

    const prompt = screen.getByRole("textbox", { name: "Prompt" })
    await user.type(prompt, "/projects{Enter}")
    expect(await screen.findByRole("list", { name: "project destinations" })).toBeInTheDocument()
    expect(screen.getByText("QuickRunLab")).toBeInTheDocument()
    expect(screen.getByText("ViperCapture")).toBeInTheDocument()
  })
})
