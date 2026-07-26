import quickRunLab from "../../../blog/posts/quickrunlab-is-back.md?raw"
import viperProxy26x from "../../../blog/posts/viperproxy-26x.md?raw"
import viperProxyMixinPatches from "../../../blog/posts/viperproxy-mixin-patches.md?raw"

export type BlogPost = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  body: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "viperproxy-mixin-patches",
    title: "Sorry about the Viper Proxy Mixin crash",
    date: "2026-07-13",
    tags: ["Viper Proxy", "Minecraft", "Patch"],
    excerpt:
      "I shipped a few Viper Proxy builds with a bad Mixin target. The fixed releases are up, and I added checks to stop the same mistake happening again.",
    body: viperProxyMixinPatches,
  },
  {
    slug: "quickrunlab-is-back",
    title: "QuickRunLab is back, with more room to run",
    date: "2026-05-29",
    tags: ["QuickRunLab", "Infra", "Update"],
    excerpt:
      "I shut QuickRunLab down a while back because I couldn't justify the hosting bill. Oracle's free tier is the reason it's running again, with more compute than it ever had.",
    body: quickRunLab,
  },
  {
    slug: "viperproxy-26x",
    title: "Porting Viperproxy to 26.x (and every version after)",
    date: "2026-05-29",
    tags: ["Minecraft", "Fabric", "Release"],
    excerpt:
      "Minecraft 26.x moved the part of the client Viperproxy hooks into. Here's how I got the proxy working again, and how I'll keep it working on every version after.",
    body: viperProxy26x,
  },
]

export function blogPostHref(post: BlogPost) {
  return `/blog/post.html?slug=${encodeURIComponent(post.slug)}`
}
