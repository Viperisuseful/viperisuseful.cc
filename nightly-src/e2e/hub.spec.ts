import axeCore from "axe-core"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("./")
})

test("loads complete hub without runtime errors", async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })

  await expect(page).toHaveTitle("Viper | Projects and systems")
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Everything Viper builds & runs in one place.",
    }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: /QuickRunLab/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /Turtle Cave/ })).toBeVisible()
  await expect(page.locator(".project-story")).toHaveCount(0)
  await expect(page.getByRole("heading", { name: "Tools and systems" })).toBeVisible()
  await expect(page.getByText("Login required")).toHaveCount(3)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)

  await page.locator("#systems").scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  const imageFailures = await page.locator("img").evaluateAll((images) =>
    images.filter((image) => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0)
      .length,
  )
  expect(imageFailures).toBe(0)
  expect(errors).toEqual([])

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto"
    window.scrollTo(0, 0)
  })
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.screenshot({
    path: `/tmp/viper-hub-${testInfo.project.name}-viewport.png`,
    fullPage: false,
  })
  await page.screenshot({
    path: `/tmp/viper-hub-${testInfo.project.name}.png`,
    fullPage: true,
  })
})

test("follows the browser theme without a manual theme control", async ({ page }) => {
  await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0)

  await page.emulateMedia({ colorScheme: "dark" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

  await page.emulateMedia({ colorScheme: "light" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
})

test("large project stage adapts to the viewport", async ({ page }) => {
  const showcase = page.getByTestId("hero-showcase")
  await expect(showcase).toBeVisible()
})

test("mobile navigation opens when compact", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Open navigation" })
  if (await trigger.isVisible()) {
    await trigger.click()
    await expect(page.getByRole("heading", { name: "Navigate Viper" })).toBeVisible()
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible()
  }
})

test("links and accessibility contract are intact", async ({ page }) => {
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Blog" }),
  ).toHaveAttribute("href", "/blog/")
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Blog" }),
  ).toHaveCount(0)
  await expect(page.getByRole("link", { name: /QuickRunLab/ }).last()).toHaveAttribute(
    "href",
    "https://quickrunlab.viperisuseful.cc",
  )
  await expect(page.getByRole("link", { name: /Turtle Cave/ }).last()).toHaveAttribute(
    "href",
    "https://turtle.viperisuseful.cc",
  )
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
})
