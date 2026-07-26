import { useEffect, useRef, useState } from "react"

import { ClaudeHeader } from "@/components/brainless/claude/claude-header"
import { ClaudeMessage } from "@/components/brainless/claude/claude-message"
import { ClaudePermission } from "@/components/brainless/claude/claude-permission"
import { ClaudeThinking } from "@/components/brainless/claude/claude-thinking"
import {
  ClaudeSlashMenu,
  type SlashCommand,
} from "@/components/brainless/claude/claude-slash-menu"
import { ClaudeToolCall } from "@/components/brainless/claude/claude-tool-call"
import { GithubCalendar } from "@/components/ui/github-calendar"
import { useLanyard } from "@/hooks/use-lanyard"
import {
  featuredProjects,
  moreProjects,
  socialLinks,
  systemDestinations,
  type Destination,
} from "@/data/destinations"

type CommandEntry = {
  id: number
  input: string
  command: string
  args: string[]
}

const THINK_DELAY_MS = 700

const commands: SlashCommand[] = [
  { name: "/help", description: "List commands and keyboard controls" },
  { name: "/whoami", description: "Viper, live presence, GitHub activity" },
  { name: "/projects", description: "Everything I maintain" },
  { name: "/systems", description: "Services and control planes" },
  { name: "/vipercapture", description: "Full-page capture system" },
  { name: "/quickrunlab", description: "Browser code runner" },
  { name: "/socials", description: "GitHub, Discord, Modrinth, email" },
  { name: "/contact", description: "Open contact routes" },
  { name: "/github", description: "Open my GitHub profile" },
  { name: "/discord", description: "Open my Discord invite" },
  { name: "/modrinth", description: "Open my Modrinth profile" },
  { name: "/email", description: "Start an email" },
  { name: "/blog", description: "Read build notes and field reports" },
  { name: "/status", description: "Open the public status page" },
  { name: "/stack", description: "Tools behind this portfolio" },
  { name: "/source", description: "Open this site's repository" },
  { name: "/open", description: "Open the last inspected project" },
  { name: "/release-notes", description: "What changed in this interface" },
  { name: "/clear", description: "Clear session output" },
  { name: "/commands", description: "Alias for /help" },
]

const projectTargets: readonly Destination[] = [
  ...featuredProjects,
  ...moreProjects,
]

const statusLabels = {
  online: "online",
  idle: "away",
  dnd: "heads-down",
  offline: "offline",
} as const

function normalizeCommand(value: string) {
  const parts = value.trim().toLowerCase().split(/\s+/)
  const raw = parts[0] || "/help"
  return {
    command: raw.startsWith("/") ? raw : `/${raw}`,
    args: parts.slice(1),
  }
}

function CommandDirectory({ items }: { items: SlashCommand[] }) {
  return (
    <dl className="command-directory" aria-label="Available commands">
      {items.map((item) => (
        <div key={item.name}>
          <dt>{item.name}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}

function NumberedDestinations({
  items,
  kind,
}: {
  items: readonly Destination[]
  kind: "project" | "system"
}) {
  return (
    <div className="numbered-directory">
      <ol className="numbered-list" aria-label={`${kind} destinations`}>
        {items.map((item, index) => (
          <li key={item.id}>
            <div>
              <span className="numbered-list__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="numbered-list__body">
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </span>
              <span className="numbered-list__meta">
                {item.access === "login" ? "auth" : item.href ? "open" : "private"}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <p className="terminal-hint">Type a number to open it.</p>
    </div>
  )
}

function IdentityOutput() {
  const state = useLanyard()
  const presence = state.presence
  const activity = presence?.activities.find((item) => item.type === 0 || item.type === 2)
  const avatar = presence?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.webp?size=128`
    : "/marks/viper.webp"

  return (
    <div className="identity-output">
      <div className="identity-output__profile" aria-live="polite">
        <img src={avatar} alt="Viper's profile" width="96" height="96" />
        <div>
          <span className="eyebrow">operator / builder / maintainer</span>
          <h2>{presence?.discord_user.global_name || presence?.discord_user.username || "Viper"}</h2>
          <p>
            {state.status === "ready" && presence
              ? `${statusLabels[presence.discord_status]}${activity ? ` · ${activity.name}${activity.state ? `: ${activity.state}` : ""}` : ""}`
              : state.status === "loading"
                ? "checking live presence..."
                : "presence unavailable · still building"}
          </p>
        </div>
      </div>
      <p className="identity-output__bio">
        I build products, self-host systems, and keep useful tools alive.
        Current bias: ship the thing, measure it, fix the sharp edges.
      </p>
      <GithubCalendar
        username="Viperisuseful"
        cellSize={10}
        cellGap={3}
        theme={{
          level0: "#202124",
          level1: "#43362e",
          level2: "#875641",
          level3: "#bc6849",
          level4: "#e58a68",
        }}
      />
    </div>
  )
}

function ProjectBrief({ project }: { project: Destination }) {
  return (
    <div className="project-brief">
      <div className="project-brief__heading">
        {project.mark ? <img src={project.mark} alt="" width="56" height="56" /> : null}
        <div>
          <span className="eyebrow">featured system</span>
          <h2>{project.name}</h2>
        </div>
      </div>
      <p>{project.description}</p>
      <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {project.href ? <p className="terminal-hint">Type /open to launch {project.name}.</p> : null}
    </div>
  )
}

function CommandOutput({ entry }: { entry: CommandEntry }) {
  switch (entry.command) {
    case "/help":
    case "/commands":
      return (
        <>
          <ClaudeMessage>Commands ready. Type one below.</ClaudeMessage>
          <CommandDirectory items={commands} />
          <p className="terminal-hint">Type / to filter · ↑↓ select · enter run · numbers open project/system choices</p>
        </>
      )
    case "/whoami":
      return <IdentityOutput />
    case "/projects":
      return <NumberedDestinations items={projectTargets} kind="project" />
    case "/systems":
      return <NumberedDestinations items={systemDestinations} kind="system" />
    case "/socials":
    case "/contact":
      return (
        <ClaudeMessage>
          Type /github, /discord, /modrinth, or /email.
        </ClaudeMessage>
      )
    case "/vipercapture":
      return <ProjectBrief project={featuredProjects.find((item) => item.id === "vipercapture")!} />
    case "/quickrunlab":
      return <ProjectBrief project={featuredProjects.find((item) => item.id === "quickrunlab")!} />
    case "/blog":
    case "/github":
    case "/discord":
    case "/modrinth":
    case "/email":
    case "/source":
    case "/open":
      return <ClaudeMessage>Navigation requested. Approval required.</ClaudeMessage>
    case "/status":
      return <ClaudeMessage>Navigation requested. Approval required.</ClaudeMessage>
    case "/stack":
      return (
        <ClaudeToolCall tool="Read" arg="portfolio.stack" result="Loaded 8 runtime choices" defaultOpen>
          {`frontend   React 19 + TypeScript + Vite
ui         brainless + shadcn/ui + Tailwind CSS
motion     Motion
presence   Lanyard API + WebSocket
hosting    GitHub Pages + Cloudflare
systems    Docker + Coolify + Oracle/OVH
code       GitHub / Viperisuseful
principle  useful beats impressive`}
        </ClaudeToolCall>
      )
    case "/release-notes":
      return (
        <ClaudeToolCall tool="Changelog" arg="v1.0.0" result="Portfolio rebuilt as ViperCode CLI" defaultOpen>
          {`+ interactive slash commands
+ live Lanyard identity
+ GitHub contribution calendar
+ numbered project and system launcher
+ keyboard-first command palette
- static brochure navigation`}
        </ClaudeToolCall>
      )
    default:
      return (
        <ClaudeToolCall tool="Resolve" arg={entry.input} result="Command not found" status="error">
          Run /help. Commands need exact names.
        </ClaudeToolCall>
      )
  }
}

function ThinkingCommandOutput({ entry }: { entry: CommandEntry }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), THINK_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ready) {
    return (
      <ClaudeThinking
        verbs={["Thinking", "Resolving", "Indexing"]}
        showTokens={false}
      />
    )
  }

  return <CommandOutput entry={entry} />
}

export function ViperCodeCli() {
  const [value, setValue] = useState("")
  const [history, setHistory] = useState<CommandEntry[]>([])
  const [selectionTargets, setSelectionTargets] = useState<readonly Destination[] | null>(null)
  const [activeTarget, setActiveTarget] = useState<Destination | null>(null)
  const [pendingRedirect, setPendingRedirect] = useState<{ label: string; href: string } | null>(null)
  const outputEndRef = useRef<HTMLDivElement>(null)
  const redirectTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(redirectTimerRef.current), [])

  const queueRedirect = (label: string, href: string) => {
    window.clearTimeout(redirectTimerRef.current)
    setPendingRedirect(null)
    redirectTimerRef.current = window.setTimeout(
      () => setPendingRedirect({ label, href }),
      THINK_DELAY_MS,
    )
  }

  const run = (rawValue: string) => {
    if (pendingRedirect) return
    const trimmed = rawValue.trim()
    if (!trimmed) return

    if (/^\d+$/.test(trimmed) && selectionTargets) {
      const target = selectionTargets[Number(trimmed) - 1]
      if (target?.href) {
        setHistory((current) => [
          ...current,
          {
            id: current.length ? current[current.length - 1]!.id + 1 : 1,
            input: trimmed,
            command: "/open",
            args: [],
          },
        ])
        queueRedirect(target.name, target.href)
        setValue("")
        return
      }
    }

    const { command, args } = normalizeCommand(trimmed)
    if (command === "/clear") {
      setHistory([])
      setSelectionTargets(null)
      setActiveTarget(null)
      setPendingRedirect(null)
      window.clearTimeout(redirectTimerRef.current)
      setValue("")
      return
    }

    const entry = {
      id: history.length ? history[history.length - 1]!.id + 1 : 1,
      input: trimmed,
      command,
      args,
    }

    setHistory((current) => [...current, entry])
    setSelectionTargets(command === "/systems" ? systemDestinations : command === "/projects" ? projectTargets : null)
    const inspectedProject = command === "/vipercapture"
      ? featuredProjects.find((item) => item.id === "vipercapture") ?? null
      : command === "/quickrunlab"
        ? featuredProjects.find((item) => item.id === "quickrunlab") ?? null
        : null
    if (inspectedProject) setActiveTarget(inspectedProject)

    const socialDestination = {
      "/github": socialLinks.find((link) => link.name === "GitHub"),
      "/discord": socialLinks.find((link) => link.name === "Discord"),
      "/modrinth": socialLinks.find((link) => link.name === "Modrinth"),
      "/email": socialLinks.find((link) => link.name === "Email"),
      "/blog": { name: "Blog", href: "/blog/" },
      "/status": {
        name: "Viper status page",
        href: "https://status.viperisuseful.cc/",
      },
      "/source": {
        name: "Portfolio source",
        href: "https://github.com/Viperisuseful/viperisuseful.cc",
      },
    }[command]
    if (socialDestination) queueRedirect(socialDestination.name, socialDestination.href)
    if (command === "/open" && activeTarget?.href) queueRedirect(activeTarget.name, activeTarget.href)
    setValue("")
    window.setTimeout(
      () => outputEndRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" }),
      0,
    )
  }

  return (
    <section className="cli-shell" aria-label="ViperCode CLI portfolio">
      <div className="cli-topbar">
        <div className="cli-topbar__brand">
          <img src="/marks/viper.webp" alt="" width="24" height="24" />
          <span>viperisuseful.cc</span>
        </div>
      </div>

      <div className="cli-workspace">
        <ClaudeHeader
          product="ViperCode CLI"
          version="v1.0.0"
          user="operator"
          model="Viper · max build mode"
          org="viperisuseful.cc"
          cwd="~/projects/viper"
          tips={[
            "Type /help to list every command",
            "Type / to filter, then use arrow keys and enter",
          ]}
          whatsNew={[
            "ViperCapture joined the featured stack",
            "GitHub activity now streams into /whoami",
          ]}
          className="cli-welcome"
        />

        <div className="cli-intro">
          <ClaudeMessage role="user">open portfolio</ClaudeMessage>
          <ClaudeMessage>
            Portfolio mounted as an interactive session. Type /help to start.
          </ClaudeMessage>
        </div>

        <div className="cli-output" aria-live="polite">
          {history.map((entry) => (
            <article className="command-turn" key={entry.id}>
              <ClaudeMessage role="user">{entry.input}</ClaudeMessage>
              <div className="command-turn__output">
                <ThinkingCommandOutput entry={entry} />
              </div>
            </article>
          ))}
          {pendingRedirect ? (
            <ClaudePermission
              title="External navigation"
              command={`open ${pendingRedirect.href}`}
              question={`Open ${pendingRedirect.label}?`}
              options={["Yes, open link", "Open in a new tab", "No, stay here"]}
              onChoose={(index) => {
                if (index === 0) window.location.assign(pendingRedirect.href)
                if (index === 1) window.open(pendingRedirect.href, "_blank", "noopener,noreferrer")
                setPendingRedirect(null)
              }}
            />
          ) : null}
          <div ref={outputEndRef} />
        </div>

        <div className="cli-composer">
          <ClaudeSlashMenu
            commands={commands}
            value={value}
            onValueChange={setValue}
            onSubmit={run}
            placeholder={pendingRedirect ? "Choose a navigation option first" : "Type /help"}
            disabled={Boolean(pendingRedirect)}
          />
          <p className="composer-note">ViperCode CLI · interactive portfolio · no data leaves this prompt</p>
        </div>
      </div>
    </section>
  )
}
