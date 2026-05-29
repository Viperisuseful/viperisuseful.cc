Minecraft 26.x is out, and the Viperproxy build for it is too. If you just want the download, it's [live on Modrinth](https://modrinth.com/user/viperisuseful1). If you want the story of what it took, keep reading.

## What broke: networking

Viperproxy has one job. It routes every connection Minecraft makes through a proxy you pick, whether that's SOCKS5, HTTP, or HTTPS, and it never leaks your real IP if that proxy goes down.

The way it does that is by slipping a proxy handler into the client's connection right before the socket opens. Find the spot where Minecraft builds the connection, drop the handler into the channel pipeline, let it run the proxy handshake, then hand the real game traffic back like nothing happened.

26.x moved that spot.

The whole connection setup got reworked. The `ClientConnection` path I'd hooked since day one had moved, and the old injection point was just gone. The mod still compiled. It just sat there doing nothing, no crash and no error in the logs, which is the worst way for something to break because you don't even notice at first.

So the fix was less "rewrite everything" and more detective work. I traced the new connection flow, found where the pipeline gets built now, and put the handler back in. Once it was in the right place again, everything downstream came back with it: the handshakes, the kill switch, the heartbeat.

> The kill switch is the one piece I won't compromise on. If the proxy can't be reached, the connection has to fail closed. A mod that quietly falls back to your real IP is worse than having no mod at all.

## What matters more: not abandoning old versions

Here's the thing about Minecraft mods. Most of them don't die because they're bad. They die because keeping up with new versions is exhausting. A version drops, the mod breaks, the author runs out of steam, and it sits frozen on some old release forever.

I don't want Viperproxy to be one of those.

So my plan is boring on purpose: a separate branch for every Minecraft version. Each version I support gets its own branch, and when a new one lands I port the changes forward by hand and cut a fresh build. No clever single-codebase trick that falls apart the first time Mojang changes something I didn't see coming. Just slow, steady upkeep.

For you, that means a few things. If you're still on an older version, that branch stays up, so moving to 26.x doesn't leave you stuck. New versions get a real port instead of a rushed compile that loads and quietly breaks, which, again, is the exact bug I just spent a weekend chasing. And every build gets tested against a live connection before it ships.

It's more work every release. I know. But a proxy mod is only worth running if you can trust it, and the only way I know to earn that is to keep showing up version after version.

26.x is on Modrinth right now. [Grab it here](https://modrinth.com/user/viperisuseful1), and if something feels off, tell me, since I'm the one porting the next version anyway.
