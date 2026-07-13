import { DiscordLogo } from "@phosphor-icons/react/DiscordLogo"

import { Skeleton } from "@/components/ui/skeleton"
import { useLanyard } from "@/hooks/use-lanyard"

const labels = {
  online: "Online",
  idle: "Away",
  dnd: "Do not disturb",
  offline: "Offline",
} as const

export function Presence() {
  const state = useLanyard()
  const presence = state.presence
  const activity = presence?.activities.find((item) => item.type === 0 || item.type === 2)
  const avatar = presence?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.webp?size=128`
    : "/marks/viper.webp"

  return (
    <section className="content-section about-section" id="about" aria-labelledby="about-title">
      <div className="about-copy">
        <h2 id="about-title">I build things because I want them to exist.</h2>
        <p>
          Some become products. Some become community tools. All of them teach me what to build
          next.
        </p>
        <a href="mailto:viper@viperisuseful.cc">viper@viperisuseful.cc</a>
      </div>

      <div className="presence-panel" aria-live="polite">
        {state.status === "loading" && (
          <>
            <Skeleton className="presence-avatar" />
            <div className="presence-loading">
              <Skeleton />
              <Skeleton />
            </div>
          </>
        )}
        {state.status === "unavailable" && (
          <>
            <DiscordLogo aria-hidden="true" className="presence-icon" />
            <div>
              <strong>Presence unavailable</strong>
              <span>Discord links still work.</span>
            </div>
          </>
        )}
        {state.status === "ready" && presence && (
          <>
            <img
              className="presence-avatar"
              src={avatar}
              alt="Viper's Discord avatar"
              width="128"
              height="128"
            />
            <div>
              <span className="presence-status">{labels[presence.discord_status]}</span>
              <strong>{presence.discord_user.global_name || presence.discord_user.username}</strong>
              <span>{activity ? `${activity.name}${activity.state ? `: ${activity.state}` : ""}` : "Building something useful"}</span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
