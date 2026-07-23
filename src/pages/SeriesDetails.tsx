import { Link, useParams } from 'react-router-dom';
import { DetailsSkeleton } from '../components/Skeletons';
import { useSeriesDetails } from '../hooks/queries';

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: series, isPending, isError } = useSeriesDetails(id!);

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Could not load this series.</p>
        <Link to="/" className="text-zinc-400 underline hover:text-zinc-200">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-8 md:flex-row">
        {series.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
            alt={series.name}
            className="w-64 shrink-0 self-center rounded-2xl shadow-lg md:self-start"
          />
        )}

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{series.name}</h1>

          {series.tagline && (
            <p className="italic text-zinc-400">{series.tagline}</p>
          )}

          <ul className="flex flex-wrap gap-2">
            {series.genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
              >
                {genre.name}
              </li>
            ))}
          </ul>

          <p className="text-sm text-zinc-400">
            {series.first_air_date.slice(0, 4)} · {series.number_of_seasons}{' '}
            {series.number_of_seasons === 1 ? 'season' : 'seasons'} ·{' '}
            {series.number_of_episodes} episodes · ★{' '}
            {series.vote_average.toFixed(1)}
          </p>

          <p className="leading-relaxed text-zinc-300">{series.overview}</p>
        </div>
      </section>
    </div>
  );
};

export default SeriesDetails;
