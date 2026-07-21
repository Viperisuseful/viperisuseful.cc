import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { SiteFooter } from "@/components/site-footer"
import { TooltipProvider } from "@/components/ui/tooltip"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("SiteFooter", () => {
  it("places the GitHub calendar between the footer lead and links", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ contributions: [], total: { lastYear: 0 } }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    )

    render(
      <TooltipProvider>
        <SiteFooter />
      </TooltipProvider>,
    )

    const lead = screen
      .getByText("Small things, useful things, and systems that run quietly in the background.")
      .closest(".site-footer__lead")
    const calendar = await screen.findByRole("region", {
      name: "Viperisuseful's GitHub contributions",
    })
    const links = screen.getByLabelText("Footer links")

    expect(lead).not.toBeNull()
    expect(lead?.nextElementSibling).toBe(calendar)
    expect(calendar.nextElementSibling).toBe(links)
  })
})
