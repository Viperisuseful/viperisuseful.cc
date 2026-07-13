import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"

import { Button } from "@/components/ui/button"
import { ProjectVisual } from "@/components/project-visual"
import { publicProjects } from "@/data/destinations"

export function ProjectField() {
  return (
    <section className="content-section project-section" id="projects" aria-labelledby="projects-title">
      <div className="section-heading">
        <h2 id="projects-title">Built, shipped, still changing.</h2>
        <p>Products, community infrastructure, and code that solve problems I wanted solved.</p>
      </div>

      <div className="project-grid">
        {publicProjects.map((project, index) => (
          <article className={`project-cell project-cell--${project.id}`} key={project.id}>
            <ProjectVisual
              alt={`${project.name} product interface`}
              image={project.image}
              mark={project.mark}
              name={project.name}
              priority={index < 2}
            />
            <div className="project-cell__body">
              <div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <div className="project-cell__footer">
                <div className="project-tags" aria-label={`${project.name} technologies`}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {project.href ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={project.href} rel="noreferrer" target="_blank">
                      {project.action}
                      <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
                    </a>
                  </Button>
                ) : (
                  <span className="no-public-link">No public link</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
