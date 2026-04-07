const COMPARE_STORAGE_KEY = 'vortexus-product-compare'
const COMPARE_CHANGED_EVENT = 'vortexus:compare-changed'
export const MAX_COMPARE_ITEMS = 4

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function emitCompareChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(COMPARE_CHANGED_EVENT))
  }
}

export function loadComparedSlugs() {
  if (!canUseStorage()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, MAX_COMPARE_ITEMS) : []
  } catch {
    return []
  }
}

function saveComparedSlugs(slugs) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(
    COMPARE_STORAGE_KEY,
    JSON.stringify(slugs.filter(Boolean).slice(0, MAX_COMPARE_ITEMS)),
  )
  emitCompareChanged()
}

export function addComparedSlug(slug) {
  const current = loadComparedSlugs()

  if (current.includes(slug)) {
    return { ok: true, slugs: current, reason: 'exists' }
  }

  if (current.length >= MAX_COMPARE_ITEMS) {
    return { ok: false, slugs: current, reason: 'limit' }
  }

  const next = [...current, slug]
  saveComparedSlugs(next)
  return { ok: true, slugs: next, reason: 'added' }
}

export function removeComparedSlug(slug) {
  const next = loadComparedSlugs().filter((item) => item !== slug)
  saveComparedSlugs(next)
  return next
}

export function toggleComparedSlug(slug) {
  const current = loadComparedSlugs()

  if (current.includes(slug)) {
    const next = current.filter((item) => item !== slug)
    saveComparedSlugs(next)
    return { ok: true, active: false, slugs: next, reason: 'removed' }
  }

  if (current.length >= MAX_COMPARE_ITEMS) {
    return { ok: false, active: false, slugs: current, reason: 'limit' }
  }

  const next = [...current, slug]
  saveComparedSlugs(next)
  return { ok: true, active: true, slugs: next, reason: 'added' }
}

export function clearComparedSlugs() {
  saveComparedSlugs([])
}

export function isCompared(slug) {
  return loadComparedSlugs().includes(slug)
}

export function subscribeToCompareChanges(callback) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (event) => {
    if (event.key === COMPARE_STORAGE_KEY) {
      callback(loadComparedSlugs())
    }
  }

  const handleInternalChange = () => {
    callback(loadComparedSlugs())
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(COMPARE_CHANGED_EVENT, handleInternalChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(COMPARE_CHANGED_EVENT, handleInternalChange)
  }
}
