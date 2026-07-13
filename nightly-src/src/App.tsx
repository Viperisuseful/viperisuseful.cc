import { TooltipProvider } from "@/components/ui/tooltip"
import { HeroLauncher } from "@/components/hero-launcher"
import { Presence } from "@/components/presence"
import { ProjectField } from "@/components/project-field"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SystemsRail } from "@/components/systems-rail"

function App() {
  return (
    <TooltipProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroLauncher />
        <ProjectField />
        <SystemsRail />
        <Presence />
      </main>
      <SiteFooter />
    </TooltipProvider>
  )
}

export default App
