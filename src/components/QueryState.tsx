import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import ErrorMessage from './ErrorMessage'

interface QueryStateProps<T> {
    query: UseQueryResult<T>
    /** Shown while the first load is in flight. */
    skeleton: ReactNode
    errorMessage: string
    children: (data: T) => ReactNode
}

/**
 * Renders one query's states, so every section on a page resolves
 * independently and none of them can blank a page on a sibling's behalf.
 *
 *  - error first, with a retry — a failed section should not be a dead end
 *  - paused with nothing cached renders nothing: a skeleton would animate a
 *    request that cannot resolve, and the OFFLINE BANNER IS A PAGE-LEVEL
 *    CONCERN. Four sections paused means one banner from the page, not four
 *    from here.
 *  - paused with data still renders the data; stale results stay useful
 */
function QueryState<T>({ query, skeleton, errorMessage, children }: QueryStateProps<T>) {
    const { data, isPending, isError, isPaused, refetch } = query

    if (isError) {
        return <ErrorMessage message={errorMessage} onRetry={() => void refetch()} />
    }

    if (isPending) {
        return isPaused ? null : <>{skeleton}</>
    }

    return <>{children(data)}</>
}

export default QueryState
