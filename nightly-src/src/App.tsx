import { TooltipProvider } from "@/components/ui/tooltip"
import { HeroLauncher } from "@/components/hero-launcher"
import { Presence } from "@/components/presence"
import { ProjectField } from "@/components/project-field"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SystemsRail } from "@/components/systems-rail"
import type { HeroVariant } from "@/lib/hero-variant"

function App({ heroVariant = "original" }: { heroVariant?: HeroVariant }) {
  return (
    <TooltipProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroLauncher variant={heroVariant} />
        <ProjectField />
        <SystemsRail />
        <Presence />
      </main>
      <SiteFooter />
    </TooltipProvider>
  )
}

export default App
