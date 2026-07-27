import { useParams } from 'react-router-dom';
import ErrorMessage, { OfflineMessage } from '../components/ErrorMessage';
import { DetailsSkeleton } from '../components/Skeletons';
import { imageUrl } from '../core/images';
import { useMovieDetails } from '../hooks/queries';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isPending, isError, isPaused } = useMovieDetails(id!);

  // Checked before isPending: a paused query is pending too, so this
  // branch has to win or we would render a skeleton that never resolves.
  if (isPaused) {
    return <OfflineMessage />;
  }

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError) {
    return <ErrorMessage message="Could not load this movie." />;
  }

  return (
    <section className="flex flex-col gap-8 md:flex-row">
        {movie.poster_path && (
          <img
            src={imageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-64 shrink-0 self-center rounded-2xl shadow-lg md:self-start"
          />
        )}

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{movie.title}</h1>

          {movie.tagline && (
            <p className="italic text-zinc-400">{movie.tagline}</p>
          )}

          <ul className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
              >
                {genre.name}
              </li>
            ))}
          </ul>

          <p className="text-sm text-zinc-400">
            {movie.release_date.slice(0, 4)} · {movie.runtime} min · ★{' '}
            {movie.vote_average.toFixed(1)}
          </p>

          <p className="leading-relaxed text-zinc-300">{movie.overview}</p>
        </div>
    </section>
  );
};

export default MovieDetails;
