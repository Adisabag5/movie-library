import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Node 25 defines its own file-backed `localStorage` global. It wins over
// jsdom's, and without --localstorage-file it is an inert plain object with
// no getItem/setItem/clear at all. Anything touching storage — these tests,
// or zustand's persist middleware inside the app — gets a broken stub.
// Install a real in-memory Storage on both window and globalThis so the two
// agree and behave like a browser.
class MemoryStorage implements Storage {
  #entries = new Map<string, string>()

  get length() {
    return this.#entries.size
  }

  key(index: number) {
    return [...this.#entries.keys()][index] ?? null
  }

  getItem(key: string) {
    return this.#entries.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.#entries.set(key, String(value))
  }

  removeItem(key: string) {
    this.#entries.delete(key)
  }

  clear() {
    this.#entries.clear()
  }
}

const storage = new MemoryStorage()

for (const target of [globalThis, window]) {
  Object.defineProperty(target, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  })
}

// jsdom does not implement scrollTo, and usePageParam calls it on every page
// change. Without this the pagination tests fail on an unimplemented method.
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  configurable: true,
  writable: true,
})

beforeEach(() => {
  storage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
