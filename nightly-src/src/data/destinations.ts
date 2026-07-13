export type DestinationAccess = "public" | "login" | "informational"

export type Destination = {
  id: string
  name: string
  description: string
  href?: string
  image?: string
  mark?: string
  access: DestinationAccess
  action: "Open project" | "Sign in" | "View source" | "No public link"
  tags: readonly string[]
}

export type SocialLink = {
  name: string
  href: string
}

export const publicProjects: readonly Destination[] = [
  {
    id: "quickrunlab",
    name: "QuickRunLab",
    description: "Run C, Python, and R in a real interactive browser terminal.",
    href: "https://quickrunlab.viperisuseful.cc",
    image: "/nightly/media/quickrunlab.webp",
    access: "public",
    action: "Open project",
    tags: ["Python", "Docker", "WebSocket"],
  },
  {
    id: "turtle-cave",
    name: "Turtle Cave",
    description: "Community tools, moderation, support, and a living corner of the web.",
    href: "https://turtle.viperisuseful.cc",
    image: "/nightly/media/turtle-cave.webp",
    access: "public",
    action: "Open project",
    tags: ["Node.js", "Discord", "MongoDB"],
  },
  {
    id: "vipersearch",
    name: "ViperSearch",
    description: "A private-minded metasearch engine hosted on Viper infrastructure.",
    href: "https://search.viperisuseful.cc",
    image: "/nightly/media/vipersearch.webp",
    access: "public",
    action: "Open project",
    tags: ["SearXNG", "Valkey"],
  },
  {
    id: "scp",
    name: "Screenshot API",
    description: "Capture full-page websites at exact dimensions with a real browser.",
    href: "https://scp.viperisuseful.cc",
    image: "/nightly/media/scp.webp",
    access: "public",
    action: "Open project",
    tags: ["FastAPI", "Playwright"],
  },
  {
    id: "vipercode",
    name: "ViperCode",
    description: "A focused Windows coding-agent app with cleaner agent flow and diffs.",
    href: "https://github.com/Viperisuseful/ViperCode",
    mark: "/nightly/marks/github.svg",
    access: "public",
    action: "View source",
    tags: ["Electron", "React", "Codex"],
  },
  {
    id: "viperproxy",
    name: "ViperProxy",
    description: "Minecraft proxy routing with a fail-closed kill switch and encrypted profiles.",
    href: "https://modrinth.com/mod/viperproxy",
    mark: "/nightly/marks/modrinth.svg",
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
    id: "coolify",
    name: "Coolify",
    description: "Deploy and operate apps running on this VM.",
    href: "https://coolify.viperisuseful.cc",
    mark: "/nightly/marks/coolify.svg",
    access: "login",
    action: "Sign in",
    tags: ["Control plane"],
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    description: "Private password vault for invited users.",
    href: "https://vault.viperisuseful.cc",
    mark: "/nightly/marks/bitwarden.svg",
    access: "login",
    action: "Sign in",
    tags: ["Encrypted vault"],
  },
  {
    id: "cdn",
    name: "CDN",
    description: "Authenticated file delivery and uploads.",
    href: "https://cdn.viperisuseful.cc",
    mark: "/nightly/marks/cloudflare.svg",
    access: "login",
    action: "Sign in",
    tags: ["Private files"],
  },
] as const

export const socialLinks: readonly SocialLink[] = [
  { name: "GitHub", href: "https://github.com/Viperisuseful" },
  { name: "Discord", href: "/discord/" },
  { name: "Modrinth", href: "/modrinth/" },
  { name: "Blog", href: "/blog/" },
  { name: "Email", href: "mailto:viper@viperisuseful.cc" },
  { name: "Privacy", href: "/privacy/" },
] as const
