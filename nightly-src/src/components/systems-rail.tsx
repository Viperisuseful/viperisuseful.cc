import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"
import { LockKey } from "@phosphor-icons/react/LockKey"

import { Badge } from "@/components/ui/badge"
import { privateSystems } from "@/data/destinations"

export function SystemsRail() {
  return (
    <section className="content-section systems-section" id="systems" aria-labelledby="systems-title">
      <div className="systems-heading">
        <div>
          <p className="systems-label">Private systems</p>
          <h2 id="systems-title">Useful if you have the key.</h2>
        </div>
        <LockKey aria-hidden="true" />
      </div>

      <div className="systems-rail">
        {privateSystems.map((system) => (
          <a href={system.href} key={system.id} rel="noreferrer" target="_blank">
            <img src={system.mark} alt="" width="32" height="32" />
            <span className="system-copy">
              <strong>{system.name}</strong>
              <span>{system.description}</span>
            </span>
            <Badge variant="outline">Login required</Badge>
            <span className="system-action">
              Sign in
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
