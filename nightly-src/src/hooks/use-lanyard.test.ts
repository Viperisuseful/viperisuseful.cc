import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useLanyard } from "./use-lanyard"

const presence = {
  discord_status: "online" as const,
  discord_user: {
    avatar: null,
    global_name: "Viper",
    id: "990680811827261490",
    username: "viperisuseful",
  },
  activities: [],
}

describe("useLanyard", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads presence and closes the socket on unmount", async () => {
    const close = vi.fn()
    let deliver: ((event: MessageEvent) => void) | null = null
    class FakeWebSocket {
      set onmessage(handler: ((event: MessageEvent) => void) | null) {
        deliver = handler
      }

      get onmessage() {
        return deliver
      }

      onclose: (() => void) | null = null
      onerror: (() => void) | null = null
      send = vi.fn()
      close = close
    }
    vi.stubGlobal("WebSocket", FakeWebSocket)
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: presence }),
      }),
    )

    const { result, unmount } = renderHook(() => useLanyard())
    await waitFor(() => expect(result.current.status).toBe("ready"))
    expect(result.current.presence?.discord_user.global_name).toBe("Viper")
    expect(() => deliver?.({ data: "not-json" } as MessageEvent)).not.toThrow()
    act(() => unmount())
    expect(close).toHaveBeenCalledOnce()
  })

  it("uses a readable unavailable state when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")))
    const { result } = renderHook(() => useLanyard())
    await waitFor(() => expect(result.current.status).toBe("unavailable"))
  })
})
