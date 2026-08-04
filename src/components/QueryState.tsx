import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import ErrorMessage from './ErrorMessage'

interface QueryStateProps<T> {
    query: UseQueryResult<T>
    skeleton: ReactNode
    errorMessage: string
    children: (data: T) => ReactNode
}

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
