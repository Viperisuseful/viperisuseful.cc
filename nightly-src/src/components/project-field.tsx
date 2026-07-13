import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"

import { moreProjects, type Destination } from "@/data/destinations"

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
    <section
      className="content-section more-projects"
      id="projects"
      aria-labelledby="more-projects-title"
    >
      <div className="section-heading">
        <h2 id="more-projects-title">More from Viper</h2>
        <p>Smaller tools, open-source work, and projects that keep moving.</p>
      </div>
      <div className="project-directory">
        {moreProjects.map((project) => (
          <ProjectDirectoryItem project={project} key={project.id} />
        ))}
      </div>
    </section>
  )
}
