import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

interface RevealProps {
    children: ReactNode
    /** Stagger a group by passing increasing delays. */
    delay?: number
    className?: string
}

/**
 * Fades and lifts its children in when they scroll into view.
 *
 * The transition lives in CSS (`reveal` / `reveal-hidden` in index.css) rather
 * than inline styles, so the reduced-motion block can force it off in one
 * place — and so a user who has asked for less motion still sees the content
 * rather than an empty page.
 */
const Reveal = ({ children, delay = 0, className = '' }: RevealProps) => {
    const { ref, inView } = useInView<HTMLDivElement>()

    return (
        <div
            ref={ref}
            className={`reveal ${inView ? '' : 'reveal-hidden'} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    )
}

export default Reveal
