import { useEffect, useState } from "react"

const USER_ID = "990680811827261490"
const API_URL = `https://api.lanyard.rest/v1/users/${USER_ID}`
const WS_URL = "wss://api.lanyard.rest/socket"

export type PresenceData = {
  discord_status: "online" | "idle" | "dnd" | "offline"
  discord_user: {
    avatar: string | null
    global_name: string | null
    id: string
    username: string
  }
  activities: Array<{ name: string; state?: string; type: number }>
}

export type LanyardState = {
  status: "loading" | "ready" | "unavailable"
  presence?: PresenceData
}

export function useLanyard(): LanyardState {
  const [state, setState] = useState<LanyardState>({ status: "loading" })

  useEffect(() => {
    let active = true
    let socket: WebSocket | undefined
    let heartbeat: number | undefined
    let reconnect: number | undefined
    let attempt = 0

    const applyPresence = (presence?: PresenceData) => {
      if (active && presence) setState({ status: "ready", presence })
    }

    const connect = () => {
      if (!active || typeof WebSocket === "undefined") return
      socket = new WebSocket(WS_URL)
      socket.onmessage = (event) => {
        let packet: {
          op: number
          t?: string
          d: PresenceData | Record<string, PresenceData> | { heartbeat_interval: number }
        }

        try {
          packet = JSON.parse(event.data) as typeof packet
        } catch {
          return
        }

        if (packet.op === 1) {
          const interval = (packet.d as { heartbeat_interval: number }).heartbeat_interval
          heartbeat = window.setInterval(() => socket?.send(JSON.stringify({ op: 3 })), interval)
          socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: USER_ID } }))
        }
        if (packet.op === 0) {
          const payload = packet.t === "INIT_STATE"
            ? (packet.d as Record<string, PresenceData>)[USER_ID]
            : (packet.d as PresenceData)
          applyPresence(payload)
          attempt = 0
        }
      }
      socket.onerror = () => socket?.close()
      socket.onclose = () => {
        window.clearInterval(heartbeat)
        if (!active) return
        reconnect = window.setTimeout(connect, Math.min(15_000, 500 * 2 ** attempt++))
      }
    }

    fetch(API_URL, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Presence request failed")
        return response.json() as Promise<{ success: boolean; data: PresenceData }>
      })
      .then((payload) => {
        if (!payload.success) throw new Error("Presence unavailable")
        applyPresence(payload.data)
        connect()
      })
      .catch(() => {
        if (active) setState({ status: "unavailable" })
      })

    return () => {
      active = false
      window.clearInterval(heartbeat)
      window.clearTimeout(reconnect)
      socket?.close()
    }
  }, [])

  return state
}
