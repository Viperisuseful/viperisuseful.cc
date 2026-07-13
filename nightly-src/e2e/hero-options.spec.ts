import axeCore from "axe-core"
import { expect, test } from "@playwright/test"

const options = [
  { route: "1/", variant: "monogram" },
  { route: "2/", variant: "signal" },
  { route: "3/", variant: "illustration" },
] as const

async function seriousAccessibilityViolations(page: import("@playwright/test").Page) {
  await page.addScriptTag({ content: axeCore.source })
  return page.evaluate(async () => {
    const axe = (window as typeof window & {
      axe: { run: () => Promise<{ violations: Array<{ impact: string | null; id: string }> }> }
    }).axe
    const result = await axe.run()
    return result.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    )
  })
}

for (const option of options) {
  test(`${option.variant} hero is healthy`, async ({ page }, testInfo) => {
    const errors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })
    page.on("pageerror", (error) => errors.push(error.message))

    await page.goto(option.route)
    await expect(page.getByTestId("launcher-brand")).toHaveAttribute(
      "data-hero-variant",
      option.variant,
    )
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    ).toBe(false)

    await page.locator("#systems").scrollIntoViewIfNeeded()
    await page.waitForTimeout(250)
    expect(
      await page.locator("img").evaluateAll(
        (images) =>
          images.filter(
            (image) =>
              !(image as HTMLImageElement).complete ||
              (image as HTMLImageElement).naturalWidth === 0,
          ).length,
      ),
    ).toBe(0)
    expect(await seriousAccessibilityViolations(page)).toEqual([])
    expect(errors).toEqual([])

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto"
      window.scrollTo(0, 0)
    })
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

    await page.screenshot({
      path: `/tmp/viper-nightly-option-${option.variant}-light-${testInfo.project.name}.png`,
      fullPage: false,
    })

    await page.evaluate(() => window.localStorage.setItem("viper-theme", "dark"))
    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await expect(page.getByTestId("launcher-brand")).toHaveAttribute(
      "data-hero-variant",
      option.variant,
    )
    expect(await seriousAccessibilityViolations(page)).toEqual([])
    expect(errors).toEqual([])

    await page.screenshot({
      path: `/tmp/viper-nightly-option-${option.variant}-dark-${testInfo.project.name}.png`,
      fullPage: false,
    })
  })
}
