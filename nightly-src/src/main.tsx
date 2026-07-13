import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import "./index.css"
import { resolveHeroVariant } from "./lib/hero-variant.ts"

const heroVariant = resolveHeroVariant(window.location.pathname)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App heroVariant={heroVariant} />
  </StrictMode>,
)
