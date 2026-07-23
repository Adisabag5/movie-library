import { useSearchParams } from 'react-router-dom';
import PosterCard from '../components/PosterCard';
import { GridSkeleton } from '../components/Skeletons';
import { useMoviesPage } from '../hooks/queries';

// TMDB rejects page numbers above 500 even when total_pages is larger.
const MAX_PAGES = 500;

const Movies = () => {
  // The current page lives in the URL (?page=3), not in useState:
  // refresh keeps your place, back/forward moves between pages,
  // and the link is shareable.
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const { data, isPending, isError, isPlaceholderData } = useMoviesPage(page);

  const goToPage = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
    window.scrollTo({ top: 0 });
  };

  if (isPending) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Movies</h1>
        <GridSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Could not load movies. Please try again later.
      </p>
    );
  }

  const totalPages = Math.min(data.total_pages, MAX_PAGES);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Movies</h1>

      {/* While the next page loads, the previous one stays visible but
          dimmed — that's keepPreviousData at work */}
      <div
        className={`grid grid-cols-3 gap-4 transition-opacity sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 ${
          isPlaceholderData ? 'opacity-50' : ''
        }`}
      >
        {data.results.map((movie) => (
          <PosterCard key={movie.id} item={movie} />
        ))}
      </div>

      <nav className="flex items-center justify-center gap-4">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Prev
        </button>

        <span className="text-sm text-zinc-400">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages || isPlaceholderData}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </nav>
    </div>
  );
};

export default Movies;
