import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

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
