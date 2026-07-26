import { ViperCodeCli } from "@/components/vipercode-cli"
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  return (
    <TooltipProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main id="main-content" className="cli-page">
        <ViperCodeCli />
      </main>
    </TooltipProvider>
  )
}

export default App
