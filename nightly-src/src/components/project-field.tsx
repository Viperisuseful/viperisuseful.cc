import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"
import { motion, useReducedMotion } from "motion/react"

import { featuredProjects, moreProjects, type Destination } from "@/data/destinations"

function ProjectStory({ project, index }: { project: Destination; index: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      className={`project-story project-story--${project.id}`}
      id={project.id}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="project-story__visual" aria-hidden="true">
        <img src={project.mark} alt="" width="1000" height="1000" />
      </div>
      <div className="project-story__copy">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <a href={project.href} rel="noreferrer" target="_blank">
          {project.action}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  )
}

function ProjectDirectoryItem({ project }: { project: Destination }) {
  const content = (
    <>
      <span className="project-directory__identity">
        {project.mark ? <img src={project.mark} alt="" width="32" height="32" /> : null}
        <strong>{project.name}</strong>
      </span>
      <span className="project-directory__description">{project.description}</span>
      <span className="project-directory__action">
        {project.action}
        {project.href ? <ArrowUpRight aria-hidden="true" /> : null}
      </span>
    </>
  )

  return project.href ? (
    <a className="project-directory__item" href={project.href} rel="noreferrer" target="_blank">
      {content}
    </a>
  ) : (
    <div className="project-directory__item project-directory__item--static">{content}</div>
  )
}

export function ProjectField() {
  return (
    <section id="projects" aria-label="Featured projects">
      <div className="project-stories">
        {featuredProjects.map((project, index) => (
          <ProjectStory project={project} index={index} key={project.id} />
        ))}
      </div>

      <div className="content-section more-projects" aria-labelledby="more-projects-title">
        <div className="section-heading">
          <h2 id="more-projects-title">More from Viper</h2>
          <p>Smaller tools, open-source work, and projects that keep moving.</p>
        </div>
        <div className="project-directory">
          {moreProjects.map((project) => (
            <ProjectDirectoryItem project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
