import { useUrlParams } from './useUrlParams'

export const SEARCH_KEY = 'q'

/**
 * Owns the `?q=` parameter, the same way usePageParam owns `?page=`.
 *
 * Writes replace rather than push. A debounced search still commits several
 * times as someone types and pauses, and each push would be its own history
 * entry — leaving the back button to walk character by character out of a
 * search instead of returning to where the user came from.
 */
export function useSearchTerm() {
    const { searchParams, update } = useUrlParams()

    const term = searchParams.get(SEARCH_KEY) ?? ''

    const setTerm = (nextTerm: string) => {
        update(
            (next) => {
                if (nextTerm) next.set(SEARCH_KEY, nextTerm)
                else next.delete(SEARCH_KEY)
            },
            { replace: true }
        )
    }

    return { term, setTerm }
}
