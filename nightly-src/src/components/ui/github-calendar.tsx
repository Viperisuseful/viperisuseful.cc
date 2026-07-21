"use client"

import {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionData = Record<
  string,
  {
    level: ContributionLevel
    label?: string
    count?: number
  }
>

export type ThemeColors = {
  level0: string
  level1: string
  level2: string
  level3: string
  level4: string
}

export type CellShape = "rounded" | "circle"

export type GithubCalendarProps = {
  username?: string
  data?: ContributionData
  startDate?: string
  endDate?: string
  startsOnSunday?: boolean
  cellSize?: number
  cellGap?: number
  cellShape?: CellShape
  theme?: "github" | "blue" | "sunset" | "purple" | "gray" | ThemeColors
  showMonthLabels?: boolean
  showStats?: boolean
  showLegend?: boolean
  className?: string
}

const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  },
  blue: {
    level0: "#eff6ff",
    level1: "#bfdbfe",
    level2: "#60a5fa",
    level3: "#2563eb",
    level4: "#1e3a8a",
  },
  sunset: {
    level0: "#fff7ed",
    level1: "#fed7aa",
    level2: "#fb923c",
    level3: "#ea580c",
    level4: "#7c2d12",
  },
  purple: {
    level0: "#faf5ff",
    level1: "#e9d5ff",
    level2: "#a855f7",
    level3: "#7e22ce",
    level4: "#3b0764",
  },
  gray: {
    level0: "#f3f4f6",
    level1: "#d1d5db",
    level2: "#9ca3af",
    level3: "#4b5563",
    level4: "#111827",
  },
}

const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#161b22",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
  blue: {
    level0: "#161e2b",
    level1: "#1e3a5f",
    level2: "#1d4ed8",
    level3: "#3b82f6",
    level4: "#93c5fd",
  },
  sunset: {
    level0: "#261a13",
    level1: "#7c2d12",
    level2: "#c2410c",
    level3: "#f97316",
    level4: "#fdba74",
  },
  purple: {
    level0: "#191124",
    level1: "#3b0764",
    level2: "#6b21a8",
    level3: "#a855f7",
    level4: "#d8b4fe",
  },
  gray: {
    level0: "#13181f",
    level1: "#374151",
    level2: "#6b7280",
    level3: "#9ca3af",
    level4: "#e5e7eb",
  },
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const EMPTY_DATA: ContributionData = {}
const FETCH_TIMEOUT_MS = 10_000

function parseDate(date: string) {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getDayNumber(date: string) {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number)
  return Date.UTC(year, month - 1, day) / 86_400_000
}

type ApiResponse = {
  contributions: { date: string; count: number; level: number }[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseApiResponse(payload: unknown): ApiResponse {
  if (!isRecord(payload) || !Array.isArray(payload.contributions)) {
    throw new Error("The GitHub activity service returned an invalid response")
  }

  const contributions = payload.contributions.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
      formatDate(parseDate(entry.date)) !== entry.date ||
      typeof entry.count !== "number" ||
      !Number.isFinite(entry.count) ||
      entry.count < 0 ||
      typeof entry.level !== "number" ||
      !Number.isFinite(entry.level)
    ) {
      throw new Error("The GitHub activity service returned invalid contribution data")
    }

    return {
      count: Math.floor(entry.count),
      date: entry.date,
      level: Math.min(4, Math.max(0, Math.floor(entry.level))),
    }
  })

  return { contributions }
}

async function fetchContributions(username: string, signal: AbortSignal) {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    { credentials: "omit", referrerPolicy: "no-referrer", signal },
  )

  if (!response.ok) {
    throw new Error(`Could not fetch contributions for "${username}" (${response.status})`)
  }

  const payload = parseApiResponse(await response.json())
  const contributions: ContributionData = {}

  for (const entry of payload.contributions) {
    contributions[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    }
  }

  return contributions
}

function buildGrid(startDate: string, endDate: string, startsOnSunday: boolean) {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  const firstDay = startsOnSunday ? 0 : 1
  const offset = (start.getDay() - firstDay + 7) % 7
  const gridStart = addDays(start, -offset)
  const weeks: (string | null)[][] = []
  const monthLabels: { label: string; weekIndex: number }[] = []
  let current = new Date(gridStart)
  let lastMonth = -1

  while (current <= end) {
    const week: (string | null)[] = []
    const weekIndex = weeks.length

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const inRange = current >= start && current <= end

      if (inRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth()
        monthLabels.push({ label: MONTH_NAMES[lastMonth] ?? "", weekIndex })
      }

      week.push(inRange ? formatDate(current) : null)
      current = addDays(current, 1)
    }

    weeks.push(week)
  }

  return { weeks, monthLabels }
}

function CalendarSkeleton({
  cellSize,
  cellGap,
  className,
}: {
  cellSize: number
  cellGap: number
  className?: string
}) {
  const step = cellSize + cellGap

  return (
    <div
      aria-label="Loading GitHub contribution calendar"
      className={cn("flex w-full animate-pulse flex-col gap-3 rounded-lg border p-4", className)}
      role="status"
    >
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="overflow-hidden">
        <svg aria-hidden="true" height={16 + 7 * step - cellGap} width={53 * step - cellGap}>
          {Array.from({ length: 53 }, (_, weekIndex) =>
            Array.from({ length: 7 }, (_, dayIndex) => (
              <rect
                className="fill-muted"
                height={cellSize}
                key={`${weekIndex}-${dayIndex}`}
                rx={cellSize * 0.2}
                width={cellSize}
                x={weekIndex * step}
                y={16 + dayIndex * step}
              />
            )),
          )}
        </svg>
      </div>
    </div>
  )
}

type TooltipState = {
  visible: boolean
  date: string
  count?: number
  label?: string
  x: number
  y: number
}

export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize = 12,
  cellGap = 3,
  cellShape = "rounded",
  theme = "github",
  showMonthLabels = true,
  showStats = true,
  showLegend = true,
  className,
}: GithubCalendarProps) {
  const calendarId = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(() =>
    typeof document === "undefined" ? false : document.documentElement.classList.contains("dark"),
  )
  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(Boolean(username) && !dataProp)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: "",
    x: 0,
    y: 0,
  })
  const [activeDate, setActiveDate] = useState(endDate ?? formatDate(new Date()))

  useEffect(() => {
    const updateTheme = () => setIsDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (dataProp) {
      setFetchedData(null)
      setFetchError(null)
      setLoading(false)
      return
    }
    if (!username) {
      setFetchedData(null)
      setFetchError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    let active = true
    let timedOut = false
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, FETCH_TIMEOUT_MS)
    setFetchedData(null)
    setFetchError(null)
    setLoading(true)

    fetchContributions(username, controller.signal)
      .then((contributions) => {
        if (active) setFetchedData(contributions)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          if (timedOut && active) setFetchError("GitHub activity took too long to load")
          return
        }
        if (active) setFetchError(error instanceof Error ? error.message : String(error))
      })
      .finally(() => {
        window.clearTimeout(timeoutId)
        if (active) setLoading(false)
      })

    return () => {
      active = false
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [dataProp, username])

  const data = dataProp ?? fetchedData ?? EMPTY_DATA
  const resolvedEnd = endDate ?? formatDate(new Date())
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate
    const date = parseDate(resolvedEnd)
    date.setFullYear(date.getFullYear() - 1)
    date.setDate(date.getDate() + 1)
    return formatDate(date)
  }, [resolvedEnd, startDate])
  const { weeks, monthLabels } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedEnd, resolvedStart, startsOnSunday],
  )
  const orderedDates = useMemo(
    () => weeks.flat().filter((date): date is string => date !== null),
    [weeks],
  )
  const stats = useMemo(() => {
    const entries = Object.entries(data)
      .filter(([date]) => date >= resolvedStart && date <= resolvedEnd)
      .sort(([first], [second]) => first.localeCompare(second))
    const total = entries.reduce(
      (sum, [, entry]) => sum + (entry.count ?? (entry.level > 0 ? 1 : 0)),
      0,
    )
    let currentStreak = 0
    let maxStreak = 0
    let previousDay: number | null = null

    for (const [date, entry] of entries) {
      if (entry.level === 0) continue
      const currentDay = getDayNumber(date)
      currentStreak = previousDay !== null && currentDay - previousDay === 1 ? currentStreak + 1 : 1
      maxStreak = Math.max(maxStreak, currentStreak)
      previousDay = currentDay
    }

    return { total, maxStreak }
  }, [data, resolvedEnd, resolvedStart])
  const lightColors = typeof theme === "object" ? theme : (THEMES[theme] ?? THEMES.github!)
  const darkColors = typeof theme === "object" ? theme : (DARK_THEMES[theme] ?? DARK_THEMES.github!)
  const activeColors = isDark ? darkColors : lightColors
  const step = cellSize + cellGap
  const monthLabelHeight = showMonthLabels ? 20 : 0
  const svgWidth = weeks.length * step - cellGap
  const svgHeight = monthLabelHeight + 7 * step - cellGap
  const cellRadius = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2
  const visibleMonthLabels = monthLabels.filter((label, index) => {
    const nextLabel = monthLabels[index + 1]
    return !nextLabel || nextLabel.weekIndex - label.weekIndex >= 3
  })

  useEffect(() => {
    if (activeDate < resolvedStart || activeDate > resolvedEnd) setActiveDate(resolvedEnd)
  }, [activeDate, resolvedEnd, resolvedStart])

  const showTooltip = (
    date: string,
    entry: ContributionData[string] | undefined,
    x: number,
    y: number,
  ) => {
    setTooltip({
      visible: true,
      date,
      count: entry?.count,
      label: entry?.label,
      x,
      y,
    })
  }

  const moveFocus = (event: KeyboardEvent<SVGRectElement>, date: string) => {
    const currentIndex = orderedDates.indexOf(date)
    let nextIndex = currentIndex

    if (event.key === "ArrowUp") nextIndex -= 1
    else if (event.key === "ArrowDown") nextIndex += 1
    else if (event.key === "ArrowLeft") nextIndex -= 7
    else if (event.key === "ArrowRight") nextIndex += 7
    else if (event.key === "Home") nextIndex = 0
    else if (event.key === "End") nextIndex = orderedDates.length - 1
    else return

    event.preventDefault()
    const nextDate = orderedDates[Math.min(orderedDates.length - 1, Math.max(0, nextIndex))]
    if (!nextDate) return
    setActiveDate(nextDate)
    document.getElementById(`${calendarId}-${nextDate}`)?.focus()
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [dataProp, fetchedData])

  if (loading) {
    return <CalendarSkeleton cellGap={cellGap} cellSize={cellSize} className={className} />
  }

  if (fetchError) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
          className,
        )}
        role="status"
      >
        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
        <span>{fetchError}.</span>
        {username ? (
          <a className="ml-auto font-semibold underline" href={`https://github.com/${username}`}>
            View GitHub profile
          </a>
        ) : null}
      </div>
    )
  }

  return (
    <section
      aria-labelledby={`${calendarId}-title`}
      className={cn("w-full overflow-hidden rounded-lg border bg-card/30", className)}
    >
      <h2 className="sr-only" id={`${calendarId}-title`}>
        {username ? `${username}'s GitHub contributions` : "GitHub contributions"}
      </h2>
      <div className="mx-auto flex w-fit max-w-full flex-col gap-3 p-4">
        <div
          className="relative overflow-x-auto"
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as CSSProperties}
        >
          <svg
            aria-label={`Contribution activity from ${resolvedStart} through ${resolvedEnd}`}
            aria-colcount={weeks.length}
            aria-rowcount={7}
            height={svgHeight}
            role="grid"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width={svgWidth}
          >
            {showMonthLabels
              ? visibleMonthLabels.map(({ label, weekIndex }) => (
                  <text
                    aria-hidden="true"
                    fill="currentColor"
                    fontFamily="inherit"
                    fontSize="12"
                    key={`${label}-${weekIndex}`}
                    x={weekIndex * step}
                    y="10"
                  >
                    {label}
                  </text>
                ))
              : null}
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <g key={dayIndex} role="row">
                {weeks.map((week, weekIndex) => {
                  const date = week[dayIndex]
                  if (!date) return null
                  const entry = data[date]
                  const level = entry?.level ?? 0
                  const y = monthLabelHeight + dayIndex * step
                  const detail = `${entry?.count ?? 0} contribution${entry?.count === 1 ? "" : "s"} on ${date}`

                  return (
                    <rect
                      aria-colindex={weekIndex + 1}
                      aria-label={detail}
                      aria-rowindex={dayIndex + 1}
                      fill={activeColors[`level${level}`]}
                      focusable="true"
                      height={cellSize}
                      id={`${calendarId}-${date}`}
                      key={date}
                      onBlur={() => setTooltip((current) => ({ ...current, visible: false }))}
                      onFocus={() => {
                        setActiveDate(date)
                        showTooltip(date, entry, weekIndex * step + cellSize / 2, y)
                      }}
                      onKeyDown={(event) => moveFocus(event, date)}
                      onPointerDown={(event) => event.currentTarget.focus()}
                      onPointerEnter={() => showTooltip(date, entry, weekIndex * step + cellSize / 2, y)}
                      onPointerLeave={(event) => {
                        if (document.activeElement !== event.currentTarget) {
                          setTooltip((current) => ({ ...current, visible: false }))
                        }
                      }}
                      role="gridcell"
                      rx={cellRadius}
                      tabIndex={date === activeDate ? 0 : -1}
                      width={cellSize}
                      x={weekIndex * step}
                      y={y}
                    >
                      <title>{detail}</title>
                    </rect>
                  )
                })}
              </g>
            ))}
          </svg>
          {tooltip.visible ? (
            <Tooltip open>
              <TooltipTrigger asChild>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 size-px"
                  style={{ left: tooltip.x, top: tooltip.y }}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <span className="font-medium">
                  {tooltip.label ?? `${tooltip.count ?? 0} contribution${tooltip.count === 1 ? "" : "s"}`}
                </span>
                <span className="opacity-70">{tooltip.date}</span>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          {showLegend ? (
            <div className="mt-0.5 flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span>Less</span>
              {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                <svg aria-hidden="true" height={cellSize} key={level} width={cellSize}>
                  <rect
                    fill={activeColors[`level${level}`]}
                    height={cellSize}
                    rx={cellRadius}
                    width={cellSize}
                  />
                </svg>
              ))}
              <span>More</span>
            </div>
          ) : null}
          {showStats ? (
            <p className="ml-auto flex flex-wrap justify-end gap-x-1 text-right text-sm text-muted-foreground">
              {username ? (
                <a className="font-semibold text-foreground underline" href={`https://github.com/${username}`}>
                  @{username}
                </a>
              ) : null}
              <span>contributed</span>
              <strong className="font-semibold text-foreground">{stats.total.toLocaleString()}</strong>
              <span>times in the last year</span>
              {stats.maxStreak > 0 ? <span>· longest streak {stats.maxStreak} days</span> : null}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
})

GithubCalendar.displayName = "GithubCalendar"
