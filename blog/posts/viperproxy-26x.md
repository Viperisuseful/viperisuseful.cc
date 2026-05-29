Minecraft 26.x is out, and so is the Viperproxy build for it. If you just want the download, it's [live on Modrinth](https://modrinth.com/user/viperisuseful1). If you want to know what it took to get there, read on.

## The part that broke: networking

Viperproxy has one job: route every connection Minecraft makes through a proxy you choose — SOCKS5, HTTP, or HTTPS — and never leak your real IP if that proxy goes down.

To pull that off, it injects a proxy handler into the client's connection right before the socket opens. Find the spot where Minecraft builds the connection, slot the handler into the channel pipeline, let it negotiate the proxy handshake, then hand the real game stream back like nothing happened.

26.x moved that spot.

The connection setup — the `ClientConnection` path Viperproxy has hooked since day one — got reworked, and the old injection point wasn't there anymore. The mod still compiled. It just quietly did nothing, which is the worst kind of broken: no crash, no error, no proxy.

So the fix was less "rewrite everything" and more detective work. Trace the new connection flow, find where the channel pipeline actually gets built now, and re-inject the handler at that point. Once the handler was back in the right place, everything downstream — the SOCKS5 and HTTP handshakes, the kill switch, the heartbeat — worked exactly as before.

> The kill switch was the one piece I refused to compromise on. If the proxy is unreachable, the connection has to fail closed. A mod that silently falls back to your real IP is worse than no mod at all.

## The part that matters more: not abandoning versions

Here's the thing about Minecraft mods — most don't die because they're bad. They die because keeping up with version churn is exhausting. A new version drops, the mod breaks, the author burns out, and it's frozen on an old release forever.

I don't want Viperproxy to be that mod.

My plan is boring on purpose: **a branch per Minecraft version.** Every supported version gets its own branch. When a new version lands, I port the changes forward by hand and cut a fresh build. No clever single-codebase trick that falls apart the moment Mojang does something unexpected — just steady, deliberate maintenance.

What that means for you:

- **Old versions keep working.** Still on an earlier release? That branch stays up. Moving to 26.x strands nobody.
- **New versions get real support** — not a rushed compile that loads and silently breaks. That's the exact bug I just spent a weekend hunting, and I'd rather catch it than ship it.
- **Every build gets tested** against a live connection before it goes out.

It's more work per release. That's the point. The whole value of a proxy mod is that you can trust it, and trust is just consistency over time.

---

26.x support is live on Modrinth right now. [Grab it here](https://modrinth.com/user/viperisuseful1) — and if something's off, tell me, because I'm the one porting the next version too.
