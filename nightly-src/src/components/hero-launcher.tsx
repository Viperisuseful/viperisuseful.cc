import { ArrowDown } from "@phosphor-icons/react/ArrowDown"
import { GithubLogo } from "@phosphor-icons/react/GithubLogo"
import { motion, useReducedMotion } from "motion/react"

import { ExternalLink } from "@/components/external-link"
import { HeroArt } from "@/components/hero-art"
import { Button } from "@/components/ui/button"

const launcherItems = [
  {
    className: "launcher-item launcher-item--quick",
    href: "https://quickrunlab.viperisuseful.cc",
    mark: "/marks/quickrunlab.png",
    width: 1000,
    height: 1000,
    label: "QuickRunLab",
  },
  {
    className: "launcher-item launcher-item--turtle",
    href: "https://turtle.viperisuseful.cc",
    mark: "/marks/turtle-cave.png",
    width: 128,
    height: 128,
    label: "Turtle Cave",
  },
] as const

export function HeroLauncher() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-kicker">Viper's corner of the internet</p>
        <h1 id="hero-title">Everything Viper runs, in one place.</h1>
        <p className="hero-summary">
          Projects, tools, communities, and private systems built and hosted by one very online
          developer.
        </p>
        <div className="hero-actions">
          <Button asChild size="lg">
            <a href="#projects">
              Explore work
              <ArrowDown aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <ExternalLink href="https://github.com/Viperisuseful">
              <GithubLogo aria-hidden="true" data-icon="inline-start" />
              GitHub
            </ExternalLink>
          </Button>
        </div>
      </div>

      <div className="launcher" aria-label="Featured project launcher">
        <motion.div
          className="launcher-brand launcher-brand--signal"
          data-hero-variant="signal"
          data-testid="launcher-brand"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroArt />
        </motion.div>
        {launcherItems.map((item, index) => (
          <motion.a
            className={item.className}
            href={item.href}
            key={item.label}
            rel="noreferrer"
            target="_blank"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: reduceMotion ? 0 : 0.12 + index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
          >
            <img
              className="launcher-item__mark"
              src={item.mark}
              alt={`${item.label} logo`}
              width={item.width}
              height={item.height}
            />
            <span>{item.label}</span>
          </motion.a>
        ))}
        <div className="launcher-orbit launcher-orbit--search" aria-hidden="true">
          VS
        </div>
        <div className="launcher-orbit launcher-orbit--scp" aria-hidden="true">
          SCP
        </div>
      </div>
    </section>
  )
}
