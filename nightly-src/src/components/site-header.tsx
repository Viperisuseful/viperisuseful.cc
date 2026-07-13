import { GithubLogo } from "@phosphor-icons/react/GithubLogo"
import { List } from "@phosphor-icons/react/List"

import { ExternalLink } from "@/components/external-link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Blog", href: "/blog/" },
  { label: "Systems", href: "/#systems" },
  { label: "About", href: "/#about" },
] as const

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="wordmark" href="/" aria-label="Viper home">
          Viper
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <ExternalLink className="nav-github" href="https://github.com/Viperisuseful">
            <GithubLogo aria-hidden="true" data-icon="inline-start" />
            GitHub
          </ExternalLink>
        </nav>

        <div className="mobile-nav">
          <Sheet>
            <SheetTrigger asChild>
              <Button aria-label="Open navigation" size="icon-lg" variant="ghost">
                <List aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigate Viper</SheetTitle>
                <SheetDescription>Blog, systems, and links.</SheetDescription>
              </SheetHeader>
              <nav className="sheet-nav" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </SheetClose>
                ))}
                <ExternalLink href="https://github.com/Viperisuseful">GitHub</ExternalLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
