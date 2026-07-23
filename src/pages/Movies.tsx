import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import PosterGrid from '../components/PosterGrid';
import { GridSkeleton } from '../components/Skeletons';
import { useMoviesPage } from '../hooks/queries';
import { usePageParam } from '../hooks/usePageParam';

const MAX_PAGES = 500;

const Movies = () => {
  const { page, goToPage } = usePageParam();
  const { data, isPending, isError, isPlaceholderData } = useMoviesPage(page);

  if (isError) {
    return <ErrorMessage message="Could not load movies. Please try again later." />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Movies</h1>

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

export default Movies;
