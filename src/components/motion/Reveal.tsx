import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

interface RevealProps {
    children: ReactNode
    delay?: number
    className?: string
}

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
