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

// Shared by the Movies and Series routes, which differ only in their
// heading, their error copy and which query feeds them. Generic over the
// item type so a Paginated<Movie> and a Paginated<Series> both fit without
// widening — the pages pass a query *result*, never a hook, so the order
// of hook calls can never change between routes.
function BrowsePage<T extends MediaItem>({
    title,
    errorMessage,
    query,
    onPageChange,
}: BrowsePageProps<T>) {
    const { data, isPending, isError, isPaused, isPlaceholderData, refetch } = query

    if (isError) {
        // `void` because refetch returns a promise we deliberately ignore —
        // the query result already drives what renders next.
        return <ErrorMessage message={errorMessage} onRetry={() => void refetch()} />
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

            {/* Sits above the grid instead of replacing it: when a page
                change is paused we still have the previous page to show.
                Checked on its own, not `isPaused && isPending` — once
                placeholder data exists isPending is false, which made the
                old condition unreachable. */}
            {isPaused && <OfflineBanner />}

            {/* No skeleton while paused: nothing is in flight, so animating
                a loading state would be a lie. */}
            {isPending && !isPaused && <GridSkeleton />}

            {!isPending && (
                <>
                    <PosterGrid list={data.results} dimmed={isPlaceholderData} />

                    {/* data.page, not the URL's page: under keepPreviousData
                        the grid may still be showing the previous page, and
                        the label must describe what is actually on screen.
                        It also makes Prev/Next relative to the visible page. */}
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
