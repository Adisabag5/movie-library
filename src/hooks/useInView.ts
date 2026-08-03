import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
    /** Start the reveal slightly before the element reaches the viewport. */
    rootMargin?: string
    /** Reveal once and stop observing, rather than re-hiding on scroll out. */
    once?: boolean
}

/**
 * Reports whether the referenced element is in the viewport.
 *
 * If IntersectionObserver is unavailable — jsdom does not implement it, and
 * neither do very old browsers — the element is reported as visible straight
 * away. Failing open matters here: failing closed would leave every revealed
 * section permanently invisible rather than merely un-animated.
 */
export function useInView<T extends HTMLElement>({
    rootMargin = '0px 0px -10% 0px',
    once = true,
}: UseInViewOptions = {}) {
    const ref = useRef<T>(null)

    // Decided at initialisation rather than set from inside the effect: with
    // no observer the content must simply start visible, and writing state
    // synchronously in an effect triggers a cascading render.
    const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

    useEffect(() => {
        const node = ref.current
        if (!node || typeof IntersectionObserver === 'undefined') return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (!entry) return

                if (entry.isIntersecting) {
                    setInView(true)
                    if (once) observer.disconnect()
                } else if (!once) {
                    setInView(false)
                }
            },
            { rootMargin }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [rootMargin, once])

    return { ref, inView }
}
