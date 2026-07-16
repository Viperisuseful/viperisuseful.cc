export type DestinationAccess = "public" | "login" | "informational"

export type Destination = {
  id: string
  name: string
  description: string
  href?: string
  mark?: string
  access: DestinationAccess
  action: string
  tags: readonly string[]
}

export type SocialLink = {
  name: string
  href: string
}

export const featuredProjects: readonly Destination[] = [
  {
    id: "quickrunlab",
    name: "QuickRunLab",
    description: "Run code in the browser without handing it your machine.",
    href: "https://quickrunlab.viperisuseful.cc",
    mark: "/marks/quickrunlab.png",
    access: "public",
    action: "Open QuickRunLab",
    tags: ["Python", "Docker", "WebSocket"],
  },
  {
    id: "vipercapture",
    name: "ViperCapture",
    description: "Capture full-page websites at exact dimensions with a real browser.",
    href: "https://capture.viperisuseful.cc",
    mark: "/marks/vipercapture.svg",
    access: "public",
    action: "Open ViperCapture",
    tags: ["FastAPI", "Playwright"],
  },
] as const

export const publicSystems: readonly Destination[] = [
  {
    id: "vipersearch",
    name: "ViperSearch",
    description: "A private-minded metasearch engine hosted on Viper infrastructure.",
    href: "https://search.viperisuseful.cc",
    mark: "/marks/viper.webp",
    access: "public",
    action: "Search the web",
    tags: ["SearXNG", "Valkey"],
  },
] as const

export const moreProjects: readonly Destination[] = [
  {
    id: "turtle-cave",
    name: "Turtle Cave",
    description: "A community dashboard, Discord bot, and place to keep the shell organized.",
    href: "https://turtle.viperisuseful.cc",
    mark: "/marks/turtle-cave.png",
    access: "public",
    action: "Visit Turtle Cave",
    tags: ["Node.js", "Discord", "MongoDB"],
  },
  {
    id: "vipercode",
    name: "ViperCode",
    description: "A focused Windows coding-agent app with cleaner agent flow and diffs.",
    href: "https://github.com/Viperisuseful/ViperCode",
    mark: "/marks/github.svg",
    access: "public",
    action: "View source",
    tags: ["Electron", "React", "Codex"],
  },
  {
    id: "viperproxy",
    name: "ViperProxy",
    description: "Minecraft proxy routing with a fail-closed kill switch and encrypted profiles.",
    href: "https://modrinth.com/mod/viperproxy",
    mark: "/marks/modrinth.svg",
    access: "public",
    action: "Open project",
    tags: ["Java", "Fabric", "Netty"],
  },
  {
    id: "dulkirmod",
    name: "DulkirMod Port",
    description: "An active Minecraft 1.21 port built with Kotlin, Java, and Fabric.",
    access: "informational",
    action: "No public link",
    tags: ["Kotlin", "Fabric"],
  },
] as const

export const privateSystems: readonly Destination[] = [
  {
    id: "cdn",
    name: "CDN",
    description: "Authenticated file delivery and uploads.",
    href: "https://cdn.viperisuseful.cc",
    mark: "/marks/cloudflare.svg",
    access: "login",
    action: "Sign in",
    tags: ["Private files"],
  },
  {
    id: "coolify",
    name: "Coolify",
    description: "Deploy and operate apps running on this VM.",
    href: "https://coolify.viperisuseful.cc",
    mark: "/marks/coolify.svg",
    access: "login",
    action: "Sign in",
    tags: ["Control plane"],
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    description: "Private password vault for invited users.",
    href: "https://vault.viperisuseful.cc",
    mark: "/marks/bitwarden.svg",
    access: "login",
    action: "Sign in",
    tags: ["Encrypted vault"],
  },
] as const

export const publicProjects: readonly Destination[] = [
  ...featuredProjects,
  ...publicSystems,
  ...moreProjects,
]

export const systemDestinations: readonly Destination[] = [...publicSystems, ...privateSystems]

export const socialLinks: readonly SocialLink[] = [
  { name: "GitHub", href: "https://github.com/Viperisuseful" },
  { name: "Discord", href: "/discord/" },
  { name: "Modrinth", href: "/modrinth/" },
  { name: "Email", href: "mailto:viper@viperisuseful.cc" },
  { name: "Privacy", href: "/privacy/" },
] as const
