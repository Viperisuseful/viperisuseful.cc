import axeCore from "axe-core"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/nightly/")
})

test("renders the lost-signal recovery page", async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))

  await expect(page).toHaveTitle("404 | Signal lost")
  await expect(page.getByRole("heading", { level: 1, name: "Signal lost." })).toBeVisible()
  await expect(page.getByText("404")).toBeVisible()
  await expect(page.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/")
  await expect(page.getByRole("link", { name: "View projects" })).toHaveAttribute(
    "href",
    "/#projects",
  )

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
  ).toBe(false)
  expect(errors).toEqual([])

  await page.addScriptTag({ content: axeCore.source })
  const violations = await page.evaluate(async () => {
    const axe = (window as typeof window & {
      axe: { run: () => Promise<{ violations: Array<{ impact: string | null; id: string }> }> }
    }).axe
    const result = await axe.run()
    return result.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    )
  })
  expect(violations).toEqual([])

  await page.screenshot({
    path: `/tmp/viper-404-${testInfo.project.name}.png`,
    fullPage: false,
  })
})

test("keeps system theme and home recovery working", async ({ page }, testInfo) => {
  await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0)
  await page.emulateMedia({ colorScheme: "dark" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await page.screenshot({
    path: `/tmp/viper-404-dark-${testInfo.project.name}.png`,
    fullPage: false,
  })

  await page.getByRole("link", { name: "Go home" }).click()
  await expect(page).toHaveURL("http://127.0.0.1:5173/")
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Everything Viper builds & runs in one place.",
    }),
  ).toBeVisible()
  await expect(page.getByTestId("hero-showcase")).toBeVisible()
})
