import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
    rootMargin?: string
    once?: boolean
}

export function useInView<T extends HTMLElement>({
    rootMargin = '0px 0px -10% 0px',
    once = true,
}: UseInViewOptions = {}) {
    const ref = useRef<T>(null)

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
