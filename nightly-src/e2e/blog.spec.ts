import axeCore from "axe-core"
import { expect, test } from "@playwright/test"

test("runs the ViperBlog Codex CLI and opens numbered posts through approval", async ({ page }) => {
  await page.goto("./blog/")
  await expect(page).toHaveTitle("ViperBlog CLI | Field notes")
  await expect(page.getByRole("main", { name: "ViperBlog CLI" })).toBeVisible()

  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await prompt.fill("/pos")
  await prompt.press("Tab")
  await expect(prompt).toHaveValue("/posts")
  await prompt.press("Enter")

  const posts = page.getByRole("list", { name: "Blog posts" })
  await expect(posts.getByText("Sorry about the Viper Proxy Mixin crash")).toBeVisible()
  await expect(posts.getByText("QuickRunLab is back, with more room to run")).toBeVisible()

  await prompt.fill("1")
  await prompt.press("Enter")
  const permission = page.getByRole("group", { name: "External navigation" })
  await expect(permission).toContainText("/blog/post.html?slug=viperproxy-mixin-patches")
  await expect(prompt).toBeDisabled()
  await permission.getByRole("radio", { name: /No, stay here/ }).click()
  await expect(prompt).toBeEnabled()
})

test("renders a Grok-style article reader and gates article links", async ({ page }) => {
  await page.goto("./blog/post.html?slug=viperproxy-26x")
  await expect(page).toHaveTitle(/Porting Viperproxy to 26\.x.*ViperBlog CLI/)
  await expect(page.getByText("ViperBlog CLI reader-1.0")).toBeVisible()
  await expect(page.getByRole("heading", { name: "What broke: networking" })).toBeVisible()
  await expect(page.getByText("Parsed Markdown and resolved journal metadata.")).toBeVisible()

  const prompt = page.getByRole("textbox", { name: "Prompt" })
  await page.getByRole("link", { name: "live on Modrinth" }).click()
  await expect(page.getByRole("group", { name: "External navigation" })).toContainText(
    "https://modrinth.com/user/viperisuseful1",
  )
  await expect(prompt).toBeDisabled()

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
