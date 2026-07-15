import { ArrowDown } from "@phosphor-icons/react/ArrowDown"
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"
import { GithubLogo } from "@phosphor-icons/react/GithubLogo"
import { motion, useReducedMotion } from "motion/react"

import { ExternalLink } from "@/components/external-link"
import { Button } from "@/components/ui/button"
import { featuredProjects } from "@/data/destinations"

const floatingMarks = [
  {
    className: "hero-float-mark--quickrunlab",
    src: "/marks/quickrunlab.png",
    label: "QuickRunLab",
  },
  {
    className: "hero-float-mark--turtle",
    src: "/marks/turtle-cave.png",
    label: "Turtle Cave",
  },
  {
    className: "hero-float-mark--vipercapture",
    src: "/marks/vipercapture.svg",
    label: "ViperCapture",
  },
  {
    className: "hero-float-mark--github",
    src: "/marks/github.svg",
    label: "GitHub",
  },
] as const

export function HeroLauncher() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-float" aria-hidden="true">
        {floatingMarks.map((mark, index) => (
          <motion.span
            className={`hero-float-mark ${mark.className}`}
            key={mark.label}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.65,
              delay: reduceMotion ? 0 : 0.08 + index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <img src={mark.src} alt="" width="96" height="96" />
          </motion.span>
        ))}
      </div>

      <motion.div
        className="hero-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          aria-label="Everything Viper builds & runs in one place."
          id="hero-title"
        >
          Everything Viper
          <br />
          builds &amp; runs
          <br />
          in one place.
        </h1>
        <p className="hero-summary">
          Projects, tools, communities, and private systems from one very online developer.
        </p>
        <div className="hero-actions">
          <Button asChild size="lg">
            <a href="#projects">
              Explore projects
              <ArrowDown aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
          <ExternalLink className="hero-source-link" href="https://github.com/Viperisuseful">
            <GithubLogo aria-hidden="true" />
            Browse the code
          </ExternalLink>
        </div>
      </motion.div>

      <motion.div
        className="hero-showcase"
        data-testid="hero-showcase"
        initial={reduceMotion ? false : { opacity: 0, y: 44, rotateX: 3 }}
        animate={{ opacity: 1, y: 0, rotateX: 1.5 }}
        transition={{ duration: 0.9, delay: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="showcase-toolbar">
          <span className="showcase-brand">Viper Hub</span>
          <span className="showcase-path">viperisuseful.cc</span>
          <span className="showcase-label">Projects</span>
        </div>
        <div className="showcase-projects">
          {featuredProjects.map((project) => (
            <a href={project.href} key={project.id} rel="noreferrer" target="_blank">
              <span className={`showcase-project__mark showcase-project__mark--${project.id}`}>
                <img src={project.mark} alt="" width="160" height="160" />
              </span>
              <span className="showcase-project__copy">
                <strong>{project.name}</strong>
                <span>{project.description}</span>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
