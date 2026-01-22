const STORAGE_KEY = "trippy.shareTokens"

type TokenStore = Record<string, string>

function readStore(): TokenStore {
  if (typeof window === "undefined") {
    return {}
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {}
  }

  try {
    return JSON.parse(raw) as TokenStore
  } catch {
    return {}
  }
}

function writeStore(store: TokenStore) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function storeShareToken(id: string, token: string) {
  const store = readStore()
  store[id] = token
  writeStore(store)
}

export function getShareToken(id: string) {
  const store = readStore()
  return store[id] ?? null
}

export function removeShareToken(id: string) {
  const store = readStore()
  if (!(id in store)) {
    return
  }
  delete store[id]
  writeStore(store)
}
