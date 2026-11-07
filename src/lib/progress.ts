import { useEffect, useState } from 'react'

export interface Progress {
  visited: Record<string, boolean>
  completed: Record<string, boolean>
  exercises: Record<string, 'revealed' | 'solved'>
  last?: string
}

const KEY = 'scc-progress-v1'
const EVT = 'scc-progress'
const empty = (): Progress => ({ visited: {}, completed: {}, exercises: {} })

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty()
  } catch {
    return empty()
  }
}

export function updateProgress(fn: (p: Progress) => void) {
  const p = loadProgress()
  fn(p)
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* storage unavailable: progress is simply not persisted */
  }
  window.dispatchEvent(new Event(EVT))
}

export function useProgress(): Progress {
  const [p, setP] = useState(loadProgress)
  useEffect(() => {
    const h = () => setP(loadProgress())
    window.addEventListener(EVT, h)
    window.addEventListener('storage', h)
    return () => {
      window.removeEventListener(EVT, h)
      window.removeEventListener('storage', h)
    }
  }, [])
  return p
}
