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
  await page.goto("./")
})

test("shows the GitHub calendar between the footer lead and links", async ({ page }) => {
  const calendar = page.getByRole("region", { name: "Viperisuseful's GitHub contributions" })
  await expect(calendar).toBeVisible()
  await expect(calendar.getByRole("link", { name: "@Viperisuseful" })).toHaveAttribute(
    "href",
    "https://github.com/Viperisuseful",
  )
  await expect(calendar.getByText("3", { exact: true })).toBeVisible()

  expect(
    await calendar.evaluate((element) => ({
      next: element.nextElementSibling?.className,
      previous: element.previousElementSibling?.className,
    })),
  ).toEqual({ next: "footer-links", previous: "site-footer__lead" })

  const previousCell = calendar.getByRole("gridcell", { name: /^1 contribution on/ })
  const latestCell = calendar.getByRole("gridcell", { name: /^2 contributions on/ })
  await latestCell.hover()
  await expect(page.getByRole("tooltip")).toContainText("2 contributions")

  await latestCell.focus()
  await page.keyboard.press("ArrowUp")
  await expect(previousCell).toBeFocused()
  await expect(page.getByRole("tooltip")).toContainText("1 contribution")

  await latestCell.dispatchEvent("pointerdown", { pointerType: "touch" })
  await expect(latestCell).toBeFocused()
  await expect(page.getByRole("tooltip")).toContainText("2 contributions")
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
  ).toBe(false)
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
  await expect(page.getByRole("link", { name: /ViperCapture/ })).toHaveAttribute(
    "href",
    "https://capture.viperisuseful.cc",
  )
  const viperCaptureMark = page.locator(".showcase-project__mark--vipercapture")
  const viperCaptureImage = viperCaptureMark.locator("img")
  const markDimensions = await viperCaptureMark.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }))
  const imageDimensions = await viperCaptureImage.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }))
  expect(imageDimensions).toEqual(markDimensions)

  const markSource = await page.evaluate(async () =>
    fetch("/marks/vipercapture.svg").then((response) => response.text()),
  )
  expect(markSource).not.toContain("M38 64H64V38C57 48 48 57 38 64Z")
  await expect(page.getByRole("heading", { name: "More works" })).toBeVisible()
  await expect(page.getByRole("link", { name: /Turtle Cave/ })).toHaveAttribute(
    "href",
    "https://turtle.viperisuseful.cc",
  )
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
  const latestContribution = page
    .getByRole("region", { name: "Viperisuseful's GitHub contributions" })
    .getByRole("gridcell", { name: /^2 contributions on/ })

  await page.emulateMedia({ colorScheme: "dark" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await expect(latestContribution).toHaveAttribute("fill", "#006d32")

  await page.emulateMedia({ colorScheme: "light" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
  await expect(latestContribution).toHaveAttribute("fill", "#40c463")
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
  const mobileNavTrigger = page.getByRole("button", { name: "Open navigation" })
  if (await mobileNavTrigger.isVisible()) {
    await mobileNavTrigger.click()
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Blog" }),
    ).toHaveAttribute("href", "/blog/")
    await page.keyboard.press("Escape")
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden()
  } else {
    await expect(
      page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Blog" }),
    ).toHaveAttribute("href", "/blog/")
  }
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
