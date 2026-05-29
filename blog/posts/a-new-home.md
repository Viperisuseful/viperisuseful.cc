For a while, viperisuseful.cc was a placeholder I kept meaning to fix. This week I finally tore it down and rebuilt it from scratch.

## Why the redesign

The old site was fine, but it looked like every other developer portfolio — a dark hero, a grid of cards, a contact form. I wanted something that felt **printed** rather than rendered: warm paper, high-contrast serif type, and a single column you actually read top to bottom.

So the whole thing now leans on three typefaces:

- **Cormorant Garamond** for the big italic display type
- **Syne** for the small uppercase labels
- **JetBrains Mono** for body text and anything technical

> The goal was simple: make it feel like a magazine spread that happens to be live and connected to my Discord presence.

## What's under the hood

No framework, no build step — it's plain HTML, CSS, and a little JavaScript hosted on GitHub Pages. The live status indicator pulls from the [Lanyard API](https://github.com/Phineas/lanyard) over a WebSocket, so when I'm online it updates in real time.

The custom Markdown renderer powering *this very page* is about a hundred lines:

```js
function renderMarkdown(md) {
  md = md.replace(/\r\n?/g, "\n");
  // extract fenced code, then walk blocks line by line
  // headings, lists, quotes, paragraphs...
  return html;
}
```

That's it — no dependencies, the same zero-build philosophy as the rest of the site.

## Why a journal

Mostly so I stop losing track of what I ship. Release notes, the occasional deep dive, and notes-to-self when I solve something annoying. If you're reading this: thanks for stopping by.

---

Next up, I want to write about how [Viperproxy](https://modrinth.com/user/viperisuseful1) actually tunnels Minecraft traffic. That one's a fun rabbit hole.
