import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { ThemeToggle } from "./theme-toggle"
import { TooltipProvider } from "./ui/tooltip"

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ""
    document.documentElement.dataset.theme = ""
  })

  it("switches and persists theme", async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>,
    )
    const toggle = screen.getByRole("button", { name: "Use dark theme" })
    await user.click(toggle)
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"))
    expect(window.localStorage.getItem("viper-theme")).toBe("dark")
    expect(screen.getByRole("button", { name: "Use light theme" })).toBeInTheDocument()
  })
})
