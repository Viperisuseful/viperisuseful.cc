import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

const fetchMock = vi.fn((input: RequestInfo | URL) => {
  if (String(input).startsWith("https://github-contributions-api.jogruber.de/")) {
    return Promise.resolve(
      new Response(JSON.stringify({ contributions: [], total: { lastYear: 0 } }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    )
  }

  return Promise.reject(new Error(`Unexpected fetch in test: ${String(input)}`))
})

Object.defineProperty(globalThis, "fetch", {
  configurable: true,
  value: fetchMock,
  writable: true,
})

afterEach(() => {
  cleanup()
  fetchMock.mockClear()
})

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  root = null
  rootMargin = "0px"
  thresholds = [0]

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: ResizeObserverMock,
})

Object.defineProperty(globalThis, "IntersectionObserver", {
  configurable: true,
  value: IntersectionObserverMock,
})
