import { ArrowUp } from "@phosphor-icons/react/ArrowUp"

import { GithubCalendar } from "@/components/ui/github-calendar"
import { socialLinks } from "@/data/destinations"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <strong>Viper</strong>
        <span>Small things, useful things, and systems that run quietly in the background.</span>
      </div>
      <GithubCalendar className="footer-calendar" username="Viperisuseful" />
      <div className="footer-links" aria-label="Footer links">
        {socialLinks.map((link) => (
          <a href={link.href} key={link.name}>
            {link.name}
          </a>
        ))}
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Viper</span>
        <a href="#main-content">
          Back to top
          <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
