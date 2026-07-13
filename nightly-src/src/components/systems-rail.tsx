import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight"
import { LockKey } from "@phosphor-icons/react/LockKey"

import { systemDestinations } from "@/data/destinations"

export function SystemsRail() {
  return (
    <section className="content-section systems-section" id="systems" aria-labelledby="systems-title">
      <div className="section-heading systems-heading">
        <h2 id="systems-title">Tools and systems</h2>
        <p>Public utilities up front. Private infrastructure stays deliberately quiet.</p>
      </div>

      <div className="systems-directory">
        {systemDestinations.map((system) => (
          <a
            className={`system-item system-item--${system.id}`}
            data-access={system.access}
            href={system.href}
            key={system.id}
            rel="noreferrer"
            target="_blank"
          >
            <span className="system-item__mark">
              {system.mark ? <img src={system.mark} alt="" width="34" height="34" /> : null}
            </span>
            <span className="system-item__copy">
              <strong>{system.name}</strong>
              <span>{system.description}</span>
            </span>
            <span className="system-item__action">
              {system.access === "login" ? (
                <>
                  <LockKey aria-hidden="true" />
                  Login required
                </>
              ) : (
                <>
                  {system.action}
                  <ArrowUpRight aria-hidden="true" />
                </>
              )}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
