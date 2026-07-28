import type { UseQueryResult } from '@tanstack/react-query'
import ErrorMessage, { OfflineBanner } from './ErrorMessage'
import Pagination from './Pagination'
import PosterGrid from './PosterGrid'
import { GridSkeleton } from './Skeletons'
import { MAX_PAGES } from '../core/http'
import type { MediaItem } from '../core/media'
import type { Paginated } from '../types/api'

interface BrowsePageProps<T extends MediaItem> {
    title: string
    errorMessage: string
    query: UseQueryResult<Paginated<T>>
    onPageChange: (page: number) => void
}

function BrowsePage<T extends MediaItem>({
    title,
    errorMessage,
    query,
    onPageChange,
}: BrowsePageProps<T>) {
    const { data, isPending, isError, isPaused, isPlaceholderData, refetch } = query

    if (isError) {
        return <ErrorMessage message={errorMessage} onRetry={() => void refetch()} />
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

            {isPaused && <OfflineBanner />}

            {isPending && !isPaused && <GridSkeleton />}

            {!isPending && (
                <>
                    <PosterGrid list={data.results} dimmed={isPlaceholderData} />

                    <Pagination
                        page={data.page}
                        totalPages={Math.min(data.total_pages, MAX_PAGES)}
                        isBusy={isPlaceholderData}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </div>
    )
}

export default BrowsePage
