import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { ClaudePermission } from "@/components/brainless/claude/claude-permission"
import { CodexHeader } from "@/components/brainless/codex/codex-header"
import { CodexMessage } from "@/components/brainless/codex/codex-message"
import {
  CodexSlashMenu,
  type CodexSlashCommand,
} from "@/components/brainless/codex/codex-slash-menu"
import { CodexWorking } from "@/components/brainless/codex/codex-working"
import { GrokHeader } from "@/components/brainless/grok/grok-header"
import { GrokMessage } from "@/components/brainless/grok/grok-message"
import { GrokPrompt } from "@/components/brainless/grok/grok-prompt"
import { GrokStatus } from "@/components/brainless/grok/grok-status"
import { GrokThought } from "@/components/brainless/grok/grok-thought"
import { GrokTurnEnd } from "@/components/brainless/grok/grok-turn-end"
import { blogPostHref, blogPosts, type BlogPost } from "@/data/blog-posts"

type Redirect = { label: string; href: string }
type BlogCommandEntry = { id: number; input: string; command: string }

const THINK_DELAY_MS = 550

const blogCommands: CodexSlashCommand[] = [
  { name: "/help", description: "show every journal command" },
  { name: "/posts", description: "list posts and choose with a number" },
  { name: "/blogs", description: "alias for /posts" },
  { name: "/latest", description: "open the newest field note" },
  { name: "/topics", description: "index posts by subject" },
  { name: "/random", description: "open a random post" },
  { name: "/about", description: "what this journal records" },
  { name: "/portfolio", description: "return to ViperCode CLI" },
  { name: "/back", description: "return to ViperCode CLI" },
  { name: "/clear", description: "clear this session" },
]

function normalizeCommand(value: string) {
  const raw = value.trim().toLowerCase().split(/\s+/)[0] || "/help"
  return raw.startsWith("/") ? raw : `/${raw}`
}

function PostDirectory({ posts = blogPosts }: { posts?: BlogPost[] }) {
  return (
    <ol className="blog-post-directory" aria-label="Blog posts">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <span className="blog-post-directory__number">{index + 1}</span>
          <span className="blog-post-directory__copy">
            <strong>{post.title}</strong>
            <small>{post.excerpt}</small>
          </span>
          <span className="blog-post-directory__date">{post.date}</span>
        </li>
      ))}
    </ol>
  )
}

function BlogHelp() {
  return (
    <dl className="blog-command-directory">
      {blogCommands.map((command) => (
        <div key={command.name}>
          <dt>{command.name}</dt>
          <dd>{command.description}</dd>
        </div>
      ))}
    </dl>
  )
}

function BlogCommandOutput({ command }: { command: string }) {
  if (command === "/posts" || command === "/blogs") {
    return (
      <>
        <CodexMessage>Indexed {blogPosts.length} field notes. Type a number to open one.</CodexMessage>
        <PostDirectory />
      </>
    )
  }
  if (command === "/help") {
    return (
      <>
        <CodexMessage>Journal commands loaded. Type / to filter; Tab completes.</CodexMessage>
        <BlogHelp />
      </>
    )
  }
  if (command === "/topics") {
    const topics = [...new Set(blogPosts.flatMap((post) => post.tags))]
    return (
      <div className="blog-topic-index">
        {topics.map((topic) => (
          <span key={topic}>
            {topic} <small>{blogPosts.filter((post) => post.tags.includes(topic)).length}</small>
          </span>
        ))}
      </div>
    )
  }
  if (command === "/about") {
    return (
      <CodexMessage>
        Build notes, release reports, mistakes, recoveries, and the useful details that do not fit on a project card.
      </CodexMessage>
    )
  }
  if (["/latest", "/random", "/portfolio", "/back", "/open"].includes(command)) {
    return <CodexMessage>Navigation requested. Approval required.</CodexMessage>
  }
  return <CodexMessage>Unknown command. Run /help.</CodexMessage>
}

function ThinkingBlogOutput({ command }: { command: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), THINK_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return ready ? <BlogCommandOutput command={command} /> : <CodexWorking label="Indexing journal" />
}

function NavigationPermission({
  pending,
  onClose,
}: {
  pending: Redirect
  onClose: () => void
}) {
  return (
    <ClaudePermission
      title="External navigation"
      command={`open ${pending.href}`}
      question={`Open ${pending.label}?`}
      options={["Yes, open link", "Open in a new tab", "No, stay here"]}
      onChoose={(index) => {
        if (index === 0) window.location.assign(pending.href)
        if (index === 1) window.open(pending.href, "_blank", "noopener,noreferrer")
        onClose()
      }}
    />
  )
}

export function ViperBlogIndex() {
  const [value, setValue] = useState("")
  const [history, setHistory] = useState<BlogCommandEntry[]>([])
  const [numberedPosts, setNumberedPosts] = useState<BlogPost[] | null>(null)
  const [pending, setPending] = useState<Redirect | null>(null)
  const outputEndRef = useRef<HTMLDivElement>(null)

  const queuePost = (post: BlogPost) => {
    setPending({ label: post.title, href: blogPostHref(post) })
  }

  const run = (rawValue: string) => {
    if (pending) return
    const trimmed = rawValue.trim()
    if (!trimmed) return

    if (/^\d+$/.test(trimmed) && numberedPosts) {
      const post = numberedPosts[Number(trimmed) - 1]
      if (post) {
        setHistory((current) => [
          ...current,
          { id: current.length ? current[current.length - 1]!.id + 1 : 1, input: trimmed, command: "/open" },
        ])
        queuePost(post)
        setValue("")
        return
      }
    }

    const command = normalizeCommand(trimmed)
    if (command === "/clear") {
      setHistory([])
      setNumberedPosts(null)
      setValue("")
      return
    }

    setHistory((current) => [
      ...current,
      { id: current.length ? current[current.length - 1]!.id + 1 : 1, input: trimmed, command },
    ])
    setNumberedPosts(command === "/posts" || command === "/blogs" ? blogPosts : null)

    if (command === "/latest") queuePost(blogPosts[0]!)
    if (command === "/random") queuePost(blogPosts[Math.floor(Math.random() * blogPosts.length)]!)
    if (command === "/portfolio" || command === "/back") {
      setPending({ label: "ViperCode CLI portfolio", href: "/" })
    }
    setValue("")
    window.setTimeout(() => outputEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0)
  }

  return (
    <main className="blog-cli-shell" aria-label="ViperBlog CLI">
      <div className="blog-cli-workspace">
        <CodexHeader
          product="ViperBlog CLI"
          version="v1.0.0"
          model="journal-index"
          directory="~/viper/blog"
        />
        <div className="blog-cli-intro">
          <CodexMessage role="user">mount journal</CodexMessage>
          <CodexMessage>Journal mounted. Type /help.</CodexMessage>
        </div>

        <section className="blog-cli-output" aria-live="polite">
          {history.map((entry) => (
            <article className="blog-command-turn" key={entry.id}>
              <CodexMessage role="user">{entry.input}</CodexMessage>
              <div className="blog-command-turn__output">
                <ThinkingBlogOutput command={entry.command} />
              </div>
            </article>
          ))}
          {pending ? <NavigationPermission pending={pending} onClose={() => setPending(null)} /> : null}
          <div ref={outputEndRef} />
        </section>

        <div className="blog-cli-composer">
          <CodexSlashMenu
            commands={blogCommands}
            value={value}
            onValueChange={setValue}
            onSubmit={run}
            placeholder={pending ? "Choose a navigation option first" : "Type /help"}
            model="journal-index"
            directory="~/viper/blog"
            disabled={Boolean(pending)}
          />
          <p className="composer-note">ViperBlog CLI · field notes from things that shipped</p>
        </div>
      </div>
    </main>
  )
}

function parseInline(text: string, onLink: (label: string, href: string) => void): ReactNode[] {
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\)|`([^`]+)`)/g
  const nodes: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index))
    if (match[2] && match[3]) {
      const label = match[2]
      const href = match[3]
      nodes.push(
        <a
          href={href}
          key={`${match.index}-${href}`}
          onClick={(event) => {
            event.preventDefault()
            onLink(label, href)
          }}
        >
          {label}
        </a>,
      )
    } else {
      nodes.push(<code key={`${match.index}-code`}>{match[4]}</code>)
    }
    cursor = pattern.lastIndex
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

function MarkdownArticle({
  body,
  onLink,
}: {
  body: string
  onLink: (label: string, href: string) => void
}) {
  const blocks = body.trim().split(/\n{2,}/)

  return (
    <div className="grok-article">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return <h2 key={index}>{parseInline(block.slice(3), onLink)}</h2>
        }
        if (block.startsWith("> ")) {
          return <blockquote key={index}>{parseInline(block.replace(/^> /gm, ""), onLink)}</blockquote>
        }
        return (
          <p key={index}>
            {block.split("\n").map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex ? <br /> : null}
                {parseInline(line, onLink)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

const articleCommands = ["/back", "/posts", "/portfolio", "/next", "/previous", "/help"]

export function ViperBlogPost() {
  const slug = new URLSearchParams(window.location.search).get("slug")
  const postIndex = blogPosts.findIndex((item) => item.slug === slug)
  const post = blogPosts[postIndex]
  const [value, setValue] = useState("")
  const [pending, setPending] = useState<Redirect | null>(null)
  const [message, setMessage] = useState("Article loaded. Reader commands: /back, /next, /previous, /portfolio.")
  const readingTime = useMemo(
    () => (post ? Math.max(1, Math.ceil(post.body.trim().split(/\s+/).length / 220)) : 0),
    [post],
  )

  useEffect(() => {
    if (post) document.title = `${post.title} | ViperBlog CLI`
  }, [post])

  if (!post) {
    return (
      <main className="blog-cli-shell">
        <div className="blog-cli-workspace">
          <GrokHeader
            product="ViperBlog CLI"
            headline="Post not found"
            subhead="The requested journal entry does not exist."
            showMenu={false}
          />
          <GrokMessage>Run /back by returning to the blog index.</GrokMessage>
          <a className="grok-return-link" href="/blog/">Return to ViperBlog CLI</a>
        </div>
      </main>
    )
  }

  const queuePost = (target: BlogPost) => {
    setPending({ label: target.title, href: blogPostHref(target) })
  }

  const run = (rawValue: string) => {
    if (pending) return
    const command = normalizeCommand(rawValue)
    if (!rawValue.trim()) return
    setValue("")

    if (command === "/back" || command === "/posts") {
      setPending({ label: "ViperBlog CLI post index", href: "/blog/" })
    } else if (command === "/portfolio") {
      setPending({ label: "ViperCode CLI portfolio", href: "/" })
    } else if (command === "/next") {
      queuePost(blogPosts[(postIndex + 1) % blogPosts.length]!)
    } else if (command === "/previous") {
      queuePost(blogPosts[(postIndex - 1 + blogPosts.length) % blogPosts.length]!)
    } else if (command === "/help") {
      setMessage(`Reader commands: ${articleCommands.join(", ")}.`)
    } else {
      setMessage("Unknown reader command. Run /help.")
    }
  }

  return (
    <main className="blog-cli-shell grok-reader-shell" aria-label={`${post.title} article`}>
      <div className="blog-cli-workspace">
        <GrokStatus
          branch="journal"
          directory={`~/viper/blog/${post.slug}.md`}
          contextUsed={`${readingTime}m`}
          contextLimit="read"
          turn={1}
          turnTotal={1}
        />
        <GrokHeader
          product="ViperBlog CLI"
          version="reader-1.0"
          headline={post.title}
          subhead={`${post.date} · ${post.tags.join(" · ")} · ${readingTime} min read`}
          showMenu={false}
        />
        <GrokThought elapsed="0.3s">Parsed Markdown and resolved journal metadata.</GrokThought>
        <GrokMessage role="user">read {post.slug}.md</GrokMessage>
        <GrokMessage className="grok-article-message">
          <MarkdownArticle
            body={post.body}
            onLink={(label, href) => setPending({ label, href })}
          />
        </GrokMessage>
        <GrokTurnEnd elapsed="0.8s" />
        <GrokMessage>{message}</GrokMessage>
        {pending ? <NavigationPermission pending={pending} onClose={() => setPending(null)} /> : null}

        <div className="blog-cli-composer grok-reader-composer">
          <GrokPrompt
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                run(value)
              }
            }}
            placeholder={pending ? "Choose a navigation option first" : "Type /help"}
            model="ViperBlog Reader"
            mode="normal"
            showShortcuts={false}
            disabled={Boolean(pending)}
          />
        </div>
      </div>
    </main>
  )
}
