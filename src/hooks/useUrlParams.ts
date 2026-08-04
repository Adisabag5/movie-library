import { useSearchParams } from 'react-router-dom'

export const PAGE_KEY = 'page'

interface UpdateOptions {
    /** Typing should not stack a history entry per keystroke. */
    replace?: boolean
    /**
     * Any change to what is being listed invalidates the current page — page 6
     * of the old result set usually does not exist in the new one. Only the
     * pager itself opts out.
     */
    keepPage?: boolean
}

/**
 * The single writer for the query string.
 *
 * usePageParam, useFilterParams and useSearchTerm each own a slice of the same
 * URLSearchParams. Before this they each copied the params by hand and two of
 * them separately re-implemented the page reset, so the rule could drift and
 * a second writer in the same tick could clobber the first. Now there is one
 * place that copies, one place that knows about `page`, and callers only
 * describe their own slice.
 */
export function useUrlParams() {
    const [searchParams, setSearchParams] = useSearchParams()

    const update = (
        mutate: (next: URLSearchParams) => void,
        { replace = false, keepPage = false }: UpdateOptions = {}
    ) => {
        setSearchParams(
            (previous) => {
                const next = new URLSearchParams(previous)
                mutate(next)
                if (!keepPage) next.delete(PAGE_KEY)
                return next
            },
            { replace }
        )
    }

    return { searchParams, update }
}
