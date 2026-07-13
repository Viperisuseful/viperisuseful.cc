I owe everyone who installed 0.6.1, 0.7.0, or 0.8.0 an apology. Those builds shipped with a stale Mixin target and could crash Minecraft during startup. I should have caught that before release. Sorry.

The replacements are out now. [0.7.1](https://github.com/Viperisuseful/viperproxy/releases/tag/v0.7.1) fixes the 26.2 pre-release build. [0.6.3](https://github.com/Viperisuseful/viperproxy/releases/tag/v0.6.3) and [0.8.2](https://github.com/Viperisuseful/viperproxy/releases/tag/v0.8.2) carry the same fix and also sort out the broken logo and profile naming. The build now checks every Mixin target against Minecraft's bytecode. I tested the clients through to the title screen too.

There is one more patch for Minecraft 26.1.2. [0.6.4](https://github.com/Viperisuseful/viperproxy/releases/tag/v0.6.4) fixes authenticated SOCKS5 proxies when Minecraft downloads a server resource pack.

If you have one of the broken builds, remove it and install the latest release for your Minecraft version. The downloads are on [GitHub](https://github.com/Viperisuseful/viperproxy/releases) and [Modrinth](https://modrinth.com/mod/viperproxy).
