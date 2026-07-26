import axeCore from "axe-core"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const toDate = (date: Date) => date.toISOString().slice(0, 10)

  await page.route("https://github-contributions-api.jogruber.de/**", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        contributions: [
          { count: 1, date: toDate(yesterday), level: 1 },
          { count: 2, date: toDate(today), level: 2 },
        ],
        total: { lastYear: 3 },
      }),
      contentType: "application/json",
      status: 200,
    })
  })

  await page.route("https://api.lanyard.rest/v1/users/**", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        success: true,
        data: {
          discord_status: "online",
          discord_user: {
            avatar: null,
            global_name: "Viper",
            id: "990680811827261490",
            username: "Viperisuseful",
          },
          activities: [{ name: "Building ViperCode", type: 0 }],
        },
      }),
      contentType: "application/json",
      status: 200,
    })
  })

  await page.goto("./")
})

test("loads the ViperCode CLI without runtime or accessibility errors", async ({ page }) => {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })

  await expect(page).toHaveTitle("ViperCode CLI | Interactive portfolio")
  await expect(page.getByRole("region", { name: "ViperCode CLI portfolio" })).toBeVisible()
  await expect(page.getByRole("group", { name: "ViperCode CLI v1.0.0" })).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Prompt" })).toBeVisible()
  await expect(page.getByText("Portfolio mounted as an interactive session. Type /help to start.")).toBeVisible()
  await expect(page.locator(".command-grid")).toHaveCount(0)

  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  await expect.poll(() =>
    page.locator("img").evaluateAll((images) =>
      images.filter((image) => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0)
        .length,
    ),
  ).toBe(0)

  await page.addScriptTag({ content: axeCore.source })
  const violations = await page.evaluate(async () => {
    const axe = (window as typeof window & {
      axe: { run: () => Promise<{ violations: Array<{ impact: string | null; id: string }> }> }
    }).axe
    const result = await axe.run()
    return result.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical",
    )
  })
  expect(violations).toEqual([])
  expect(errors).toEqual([])
})

test("runs /whoami from the semantic slash menu", async ({ page }) => {
  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/who")
  const menu = page.getByRole("listbox", { name: "Slash commands" })
  await expect(menu).toBeVisible()
  await expect(menu.getByRole("option", { name: /\/whoami/i })).toHaveAttribute("aria-selected", "true")
  await prompt.press("Enter")

  await expect(page.getByRole("heading", { name: "Viper", exact: true })).toBeVisible()
  const calendar = page.getByRole("region", { name: "Viperisuseful's GitHub contributions" })
  await expect(calendar).toBeVisible()
  await expect(calendar.getByText("3", { exact: true })).toBeVisible()
})

test("lists projects and systems as numbered destinations", async ({ page }) => {
  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/projects")
  await prompt.press("Enter")
  const projects = page.getByRole("list", { name: "project destinations" })
  await expect(projects.getByText("QuickRunLab", { exact: true })).toBeVisible()
  await expect(projects.getByText("ViperCapture", { exact: true })).toBeVisible()
  await expect(projects.getByRole("link")).toHaveCount(0)

  await prompt.fill("/systems")
  await prompt.press("Enter")
  const systems = page.getByRole("list", { name: "system destinations" })
  await expect(systems.getByText("ViperSearch", { exact: true })).toBeVisible()
  await expect(systems.getByText("auth", { exact: true })).toHaveCount(3)
})

test("asks permission before every redirect", async ({ page }) => {
  await expect(page.getByRole("link", { name: /status\.viperisuseful\.cc/i })).toHaveCount(0)
  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/status")
  await prompt.press("Enter")

  const permission = page.getByRole("group", { name: "External navigation" })
  await expect(permission).toContainText("open https://status.viperisuseful.cc/")
  await expect(permission.getByRole("radiogroup", { name: "Open Viper status page?" })).toBeVisible()
  await expect(prompt).toBeDisabled()
  await permission.getByRole("radio", { name: /No, stay here/ }).click()
  await expect(permission).toBeHidden()
  await expect(prompt).toBeEnabled()

  await prompt.fill("/github")
  await prompt.press("Enter")
  await expect(page.getByRole("group", { name: "External navigation" })).toContainText(
    "github.com/Viperisuseful",
  )
})

test("completes slash commands with Tab", async ({ page }) => {
  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/sou")
  await expect(page.getByRole("option", { name: /\/source/i })).toHaveAttribute(
    "aria-selected",
    "true",
  )
  await prompt.press("Tab")
  await expect(prompt).toHaveValue("/source")
  await expect(prompt).toBeFocused()
})

test("does not expose the removed history command", async ({ page }) => {
  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/")
  await expect(page.getByRole("option", { name: /\/history/i })).toHaveCount(0)
})

test("moves permission selection with arrows and executes with Enter", async ({ page }) => {
  await page.evaluate(() => {
    const state = window as typeof window & { openedDestination?: string }
    window.open = ((url?: string | URL) => {
      state.openedDestination = String(url)
      return null
    }) as typeof window.open
  })

  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/status")
  await prompt.press("Enter")

  const permission = page.getByRole("group", { name: "External navigation" })
  const first = permission.getByRole("radio", { name: /Yes, open link/ })
  const second = permission.getByRole("radio", { name: /Open in a new tab/ })
  await expect(first).toBeFocused()
  await expect(first).toHaveAttribute("aria-checked", "true")

  await page.keyboard.press("ArrowDown")
  await expect(second).toBeFocused()
  await expect(second).toHaveAttribute("aria-checked", "true")
  await page.keyboard.press("Enter")

  await expect
    .poll(() => page.evaluate(() => (
      window as typeof window & { openedDestination?: string }
    ).openedDestination))
    .toBe("https://status.viperisuseful.cc/")
  await expect(permission).toBeHidden()
})

test("stays usable at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 760 })
  await page.reload()
  await expect(page.getByRole("textbox", { name: "Prompt" })).toBeVisible()
  await expect(page.getByText("Type /help to list every command")).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
})
