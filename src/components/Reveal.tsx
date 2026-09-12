import { createElement, type ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

/** Elements a revealed block is allowed to render as, so wrappers stay semantic. */
type RevealTag = 'div' | 'dl' | 'figure' | 'h1' | 'li' | 'p' | 'ul'

type RevealProps = {
  children: ReactNode
  /** Milliseconds to wait before this block moves — used to stagger siblings. */
  delay?: number
  /** Animate on mount instead of waiting for the block to scroll into view. */
  immediate?: boolean
  as?: RevealTag
  className?: string
}

/**
 * Floats its children up into place the first time they come into view.
 * Do not put this on an element that already carries a `transition-*` class —
 * the utility would win and cancel the reveal transition.
 */
export function Reveal({
  children,
  delay = 0,
  immediate = false,
  as = 'div',
  className,
}: RevealProps) {
  const { ref, shown } = useReveal<HTMLElement>(immediate)

  return createElement(
    as,
    {
      ref,
      className: ['nh-reveal', shown && 'is-in', className].filter(Boolean).join(' '),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  )
}
