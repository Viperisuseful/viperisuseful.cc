import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft"
import { ArrowDown } from "@phosphor-icons/react/ArrowDown"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

export function NotFound() {
  return (
    <TooltipProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main className="not-found-page" id="main-content">
        <section className="not-found" aria-labelledby="not-found-title">
          <div className="not-found__signal" aria-hidden="true">
            <div className="not-found__rings" />
            <span>404</span>
          </div>

          <div className="not-found__copy">
            <h1 id="not-found-title">Signal lost.</h1>
            <p>This address does not connect to anything Viper runs.</p>
            <div className="not-found__actions">
              <Button asChild size="lg">
                <a href="/">
                  <ArrowLeft aria-hidden="true" data-icon="inline-start" />
                  Go home
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/#projects">
                  View projects
                  <ArrowDown aria-hidden="true" data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </TooltipProvider>
  )
}
