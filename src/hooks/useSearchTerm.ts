import { useUrlParams } from './useUrlParams'

export const SEARCH_KEY = 'q'

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
