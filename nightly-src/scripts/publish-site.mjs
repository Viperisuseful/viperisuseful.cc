import { cp, readFile, rm, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dirname, "../..")
const buildRoot = resolve(repositoryRoot, "site-dist")

for (const directory of ["hub-assets", "marks", "media"]) {
  await rm(resolve(repositoryRoot, directory), { force: true, recursive: true })
  await cp(resolve(buildRoot, directory), resolve(repositoryRoot, directory), {
    recursive: true,
  })
}

const homeHtml = await readFile(resolve(buildRoot, "index.html"), "utf8")
const notFoundHtml = homeHtml
  .replace('content="index, follow"', 'content="noindex, nofollow"')
  .replace('<title>Viper | Projects and systems</title>', '<title>404 | Signal lost</title>')
  .replace(/\s*<link rel="canonical"[^>]+>/, "")

await writeFile(resolve(repositoryRoot, "index.html"), homeHtml)
await writeFile(resolve(repositoryRoot, "404.html"), notFoundHtml)
await rm(resolve(repositoryRoot, "nightly"), { force: true, recursive: true })
await rm(buildRoot, { force: true, recursive: true })
