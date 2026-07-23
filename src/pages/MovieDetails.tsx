import { Link, useParams } from 'react-router-dom';
import { DetailsSkeleton } from '../components/Skeletons';
import { useMovieDetails } from '../hooks/queries';

const MovieDetails = () => {
  // The route is 'movie/:id', so the router guarantees id exists here —
  // that's what the non-null assertion (!) expresses.
  const { id } = useParams<{ id: string }>();
  const { data: movie, isPending, isError } = useMovieDetails(id!);

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Could not load this movie.</p>
        <Link to="/" className="text-zinc-400 underline hover:text-zinc-200">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-8 md:flex-row">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
    </div>
  );
};

export default MovieDetails;
