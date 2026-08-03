import { useSearchParams } from 'react-router-dom'

export const SEARCH_KEY = 'q'

/**
 * Owns the `?q=` parameter, the same way usePageParam owns `?page=`.
 *
 * Writes use `replace: true` on purpose. A debounced search still commits
 * several times as someone types and pauses, and each push would be its own
 * history entry — leaving the back button to walk character by character out
 * of a search instead of returning to where the user came from.
 */
export function useSearchTerm() {
    const [searchParams, setSearchParams] = useSearchParams()

    const term = searchParams.get(SEARCH_KEY) ?? ''

    const setTerm = (nextTerm: string) => {
        setSearchParams(
            (previous) => {
                const next = new URLSearchParams(previous)

                if (nextTerm) next.set(SEARCH_KEY, nextTerm)
                else next.delete(SEARCH_KEY)

                // A new search invalidates the current page for the same
                // reason a filter change does: page 6 of the old result set
                // usually does not exist in the new one.
                next.delete('page')

                return next
            },
            { replace: true }
        )
    }

    return { term, setTerm }
}
