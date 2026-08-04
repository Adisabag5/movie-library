import { useSearchParams } from 'react-router-dom'

export const PAGE_KEY = 'page'

interface UpdateOptions {
    replace?: boolean
    keepPage?: boolean
}

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
