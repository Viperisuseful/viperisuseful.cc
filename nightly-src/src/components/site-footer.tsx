import { ArrowUp } from "@phosphor-icons/react/ArrowUp"

import { socialLinks } from "@/data/destinations"

export function SiteFooter() {
  return (
    <footer className="site-footer">
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
