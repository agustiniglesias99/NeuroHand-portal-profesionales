import { useEffect, useRef, useState } from 'react'

/**
 * A block starts moving once ~12% of it has crossed into the viewport, with the
 * bottom edge of the root pulled up so nothing animates while still off-screen.
 */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.12,
}

/** One observer for the whole page instead of one per revealed block. */
let observer: IntersectionObserver | null = null
const pending = new WeakMap<Element, () => void>()

function sharedObserver() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const reveal = pending.get(entry.target)
        pending.delete(entry.target)
        observer?.unobserve(entry.target)
        reveal?.()
      }
    }, OBSERVER_OPTIONS)
  }
  return observer
}

/**
 * Reveals a block once — when it scrolls into view, or straight away when
 * `immediate` is set (used above the fold, where there is no scroll to wait for).
 * Without IntersectionObserver support the block simply shows itself.
 */
export function useReveal<T extends HTMLElement>(immediate: boolean) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || shown) return

    if (immediate || typeof IntersectionObserver === 'undefined') {
      // Let the hidden state paint for a frame so the transition has somewhere to run from.
      const frame = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(frame)
    }

    const io = sharedObserver()
    pending.set(node, () => setShown(true))
    io.observe(node)

    return () => {
      pending.delete(node)
      io.unobserve(node)
    }
  }, [immediate, shown])

  return { ref, shown }
}
