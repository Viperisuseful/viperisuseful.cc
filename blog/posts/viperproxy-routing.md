Viperproxy is a Fabric mod that routes **every** multiplayer connection Minecraft makes through a proxy of your choice — SOCKS5, HTTP, or HTTPS. Here's roughly how it works.

## The problem

Minecraft's networking is built on [Netty](https://netty.io/), and by default it opens a raw TCP channel straight to the server. There's no built-in notion of "send this through a proxy." So the trick is to inject ourselves into the channel pipeline *before* the connection is established.

## Intercepting the connection

When the client builds its `Bootstrap`, we add a handler at the very front of the pipeline. That handler wraps the outbound socket in a proxy handshake:

```java
pipeline.addFirst("viperproxy", switch (type) {
    case SOCKS5 -> new Socks5ProxyHandler(addr, user, pass);
    case HTTP   -> new HttpProxyHandler(addr, user, pass);
});
```

Netty ships these handlers already, which is lovely — they negotiate the proxy handshake and then transparently hand the real Minecraft stream back to the pipeline.

## The kill switch

The part I care about most: if the proxy is unreachable, the connection must **fail closed**, never fall back to your real IP. The logic is roughly:

1. Attempt the proxy handshake with a short timeout
2. If it fails, drop the channel immediately
3. Surface a clear error on the Multiplayer screen
4. *Never* retry without the proxy

> Failing closed is the whole point. A proxy mod that silently leaks your IP on error is worse than no proxy at all.

## Profiles and credentials

Multiple proxies live in encrypted on-disk profiles, and a 15-second heartbeat pings the active one so you know it's alive before you join a server. Credentials never touch logs.

That's the short version. The source is on [GitHub](https://github.com/Viperisuseful/viperproxy) if you want the gory details.
