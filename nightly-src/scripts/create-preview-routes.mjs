import { copyFile, mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const outputRoot = resolve(import.meta.dirname, "../../nightly")

await Promise.all(
  ["1", "2", "3"].map(async (route) => {
    const routeDirectory = resolve(outputRoot, route)
    await mkdir(routeDirectory, { recursive: true })
    await copyFile(resolve(outputRoot, "index.html"), resolve(routeDirectory, "index.html"))
  }),
)
