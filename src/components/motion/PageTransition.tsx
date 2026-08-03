import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Replays an enter animation whenever the route changes.
 *
 * Keyed on `pathname` only, deliberately. A key change remounts the subtree,
 * which is what restarts the animation — but keying on the full location would
 * also remount on every `?page=` and `?q=` change, throwing away the grid mid
 * pagination and fighting keepPreviousData. Route changes animate; query
 * changes do not.
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
    const { pathname } = useLocation()

    return (
        <div key={pathname} className="animate-page-in">
            {children}
        </div>
    )
}

export default PageTransition
