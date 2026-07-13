import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"
import type { AnchorHTMLAttributes, PropsWithChildren } from "react"

type ExternalLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a rel="noreferrer" target="_blank" {...props}>
      {children}
      <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
    </a>
  )
}
