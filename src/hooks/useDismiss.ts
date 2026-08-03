import { useEffect, useRef } from 'react'

/**
 * Dismisses an open popover on an outside pointer press or Escape, and
 * returns the ref marking what counts as "inside".
 *
 * The callback is held in a ref so the listeners are bound once per open
 * rather than on every render — otherwise an inline arrow from the caller
 * would tear down and re-attach both listeners continuously.
 */
export function useDismiss<T extends HTMLElement>(open: boolean, onDismiss: () => void) {
  const ref = useRef<T>(null)
  const dismiss = useRef(onDismiss)

  useEffect(() => {
    dismiss.current = onDismiss
  })

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) dismiss.current()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss.current()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return ref
}
