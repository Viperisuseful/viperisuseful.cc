import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { GithubCalendar } from "@/components/ui/github-calendar"
import { TooltipProvider } from "@/components/ui/tooltip"

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("GithubCalendar", () => {
  it("renders contribution totals and supports keyboard and touch details", async () => {
    render(
      <TooltipProvider>
        <GithubCalendar
          data={{
            "2026-07-19": { count: 1, level: 1 },
            "2026-07-20": { count: 2, level: 2 },
            "2026-07-21": { count: 0, level: 0 },
          }}
          endDate="2026-07-21"
          startDate="2026-07-19"
          username="Viperisuseful"
        />
      </TooltipProvider>,
    )

    const calendar = screen.getByRole("region", { name: "Viperisuseful's GitHub contributions" })
    expect(within(calendar).getByRole("link", { name: "@Viperisuseful" })).toHaveAttribute(
      "href",
      "https://github.com/Viperisuseful",
    )
    expect(within(calendar).getByText("3")).toBeInTheDocument()
    const firstDay = within(calendar).getByRole("gridcell", {
      name: "1 contribution on 2026-07-19",
    })
    const secondDay = within(calendar).getByRole("gridcell", {
      name: "2 contributions on 2026-07-20",
    })
    fireEvent.focus(firstDay)
    expect(await screen.findByRole("tooltip")).toHaveTextContent("1 contribution")

    fireEvent.keyDown(firstDay, { key: "ArrowDown" })
    expect(secondDay).toHaveAttribute("tabindex", "0")
    fireEvent.focus(secondDay)
    expect(screen.getByRole("tooltip")).toHaveTextContent("2 contributions")

    fireEvent.pointerEnter(firstDay)
    expect(screen.getByRole("tooltip")).toHaveTextContent("1 contribution")
  })

  it("counts level-only manual data and calendar-day streaks", () => {
    render(
      <TooltipProvider>
        <GithubCalendar
          data={{
            "2026-03-07": { level: 1 },
            "2026-03-08": { level: 2 },
            "2026-03-09": { level: 3 },
          }}
          endDate="2026-03-09"
          startDate="2026-03-07"
        />
      </TooltipProvider>,
    )

    const calendar = screen.getByRole("region", { name: "GitHub contributions" })
    expect(within(calendar).getByText("3", { exact: true })).toBeInTheDocument()
    expect(within(calendar).getByText("· longest streak 3 days")).toBeInTheDocument()
  })

  it("fetches and validates rolling contribution data with private request options", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          contributions: [{ count: 4, date: "2026-07-21", level: 3 }],
          total: { lastYear: 4 },
        }),
        { headers: { "Content-Type": "application/json" }, status: 200 },
      ),
    )
    vi.stubGlobal("fetch", fetchMock)

    render(
      <TooltipProvider>
        <GithubCalendar endDate="2026-07-21" startDate="2026-07-21" username="Viperisuseful" />
      </TooltipProvider>,
    )

    expect(screen.getByRole("status", { name: "Loading GitHub contribution calendar" })).toBeVisible()
    const calendar = await screen.findByRole("region", {
      name: "Viperisuseful's GitHub contributions",
    })
    expect(within(calendar).getByText("4", { exact: true })).toBeVisible()
    expect(fetchMock).toHaveBeenCalledWith(
      "https://github-contributions-api.jogruber.de/v4/Viperisuseful?y=last",
      expect.objectContaining({ credentials: "omit", referrerPolicy: "no-referrer" }),
    )
  })

  it("shows a profile fallback for non-OK and malformed responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contributions: null }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      )
    vi.stubGlobal("fetch", fetchMock)

    const first = render(
      <TooltipProvider>
        <GithubCalendar username="Viperisuseful" />
      </TooltipProvider>,
    )
    expect(await screen.findByText(/Could not fetch contributions/)).toBeVisible()
    expect(screen.getByRole("link", { name: "View GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/Viperisuseful",
    )

    first.unmount()
    render(
      <TooltipProvider>
        <GithubCalendar username="Viperisuseful" />
      </TooltipProvider>,
    )
    expect(await screen.findByText(/invalid response/)).toBeVisible()
  })

  it("times out a stalled contribution request", async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"))
          })
        }),
      ),
    )

    render(
      <TooltipProvider>
        <GithubCalendar username="Viperisuseful" />
      </TooltipProvider>,
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })

    expect(screen.getByText("GitHub activity took too long to load.")).toBeVisible()
    expect(screen.getByRole("link", { name: "View GitHub profile" })).toBeVisible()
  })

  it("replaces a loading request with supplied data", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)))
    const { rerender } = render(
      <TooltipProvider>
        <GithubCalendar username="Viperisuseful" />
      </TooltipProvider>,
    )
    expect(screen.getByRole("status", { name: "Loading GitHub contribution calendar" })).toBeVisible()

    rerender(
      <TooltipProvider>
        <GithubCalendar
          data={{ "2026-07-21": { count: 5, level: 4 } }}
          endDate="2026-07-21"
          startDate="2026-07-21"
          username="Viperisuseful"
        />
      </TooltipProvider>,
    )

    expect(screen.getByRole("region", { name: "Viperisuseful's GitHub contributions" })).toBeVisible()
    expect(screen.queryByRole("status", { name: "Loading GitHub contribution calendar" })).toBeNull()
  })

  it("replaces a failed request with supplied data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })))
    const { rerender } = render(
      <TooltipProvider>
        <GithubCalendar username="Viperisuseful" />
      </TooltipProvider>,
    )
    expect(await screen.findByText(/Could not fetch contributions/)).toBeVisible()

    rerender(
      <TooltipProvider>
        <GithubCalendar
          data={{ "2026-07-21": { count: 5, level: 4 } }}
          endDate="2026-07-21"
          startDate="2026-07-21"
          username="Viperisuseful"
        />
      </TooltipProvider>,
    )

    expect(screen.getByRole("region", { name: "Viperisuseful's GitHub contributions" })).toBeVisible()
    expect(screen.queryByText(/Could not fetch contributions/)).toBeNull()
  })
})
