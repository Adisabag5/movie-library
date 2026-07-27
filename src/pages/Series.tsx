import ErrorMessage, { OfflineMessage } from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import PosterGrid from '../components/PosterGrid';
import { GridSkeleton } from '../components/Skeletons';
import { useSeriesPage } from '../hooks/queries';
import { usePageParam } from '../hooks/usePageParam';

const MAX_PAGES = 500;

const Series = () => {
  const { page, goToPage } = usePageParam();
  const { data, isPending, isError, isPaused, isPlaceholderData } = useSeriesPage(page);

  if (isError) {
    return <ErrorMessage message="Could not load series. Please try again later." />;
  }

  if (isPaused && isPending) {
    return <OfflineMessage />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Series</h1>

      {isPending ? (
        <GridSkeleton />
      ) : (
        <>
          <PosterGrid list={data.results} dimmed={isPlaceholderData} />

          <Pagination
            page={page}
            totalPages={Math.min(data.total_pages, MAX_PAGES)}
            isBusy={isPlaceholderData}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
};

export default Series;
