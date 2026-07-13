import { ImageBroken } from "@phosphor-icons/react/ImageBroken"
import { useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"

type ProjectVisualProps = {
  alt: string
  image?: string
  mark?: string
  name: string
  priority?: boolean
}

export function ProjectVisual({ alt, image, mark, name, priority = false }: ProjectVisualProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!image) {
    return (
      <div className="project-mark" aria-hidden="true">
        {mark ? <img src={mark} alt="" width="72" height="72" /> : <span>{name.slice(0, 2)}</span>}
      </div>
    )
  }

  if (failed) {
    return (
      <div className="project-image-fallback">
        <ImageBroken aria-hidden="true" />
        <span>{name}</span>
      </div>
    )
  }

  return (
    <div className="project-image">
      {!loaded && <Skeleton className="project-image__skeleton" />}
      <img
        alt={alt}
        decoding="async"
        height="750"
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        src={image}
        width="1200"
      />
    </div>
  )
}
