import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import ErrorMessage, { OfflineBanner } from '../components/ErrorMessage';
import { DetailsSkeleton } from '../components/Skeletons';
import { imageUrl } from '../core/images';
import { useMovieDetails } from '../hooks/queries';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isPending, isError, isPaused, refetch } = useMovieDetails(id!);

  if (isError) {
    return (
      <ErrorMessage
        message="Could not load this movie."
        onRetry={() => void refetch()}
      />
    );
  }

  if (isPending) {
    return isPaused ? <OfflineBanner /> : <DetailsSkeleton />;
  }

  return (
    <div className="animate-fade-up">
      <title>{`${movie.title} — Movie Library`}</title>

      {isPaused && <OfflineBanner />}

      <BackButton fallback="/movies" label="All movies" />

      <section className="flex flex-col gap-8 md:flex-row">
        {movie.poster_path && (
          <img
            src={imageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-64 shrink-0 self-center rounded-2xl shadow-xl shadow-ink/20 ring-1 ring-bark/50 md:self-start"
          />
        )}

        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-ink">{movie.title}</h1>

          {movie.tagline && (
            <p className="text-lg italic text-accent-deep">{movie.tagline}</p>
          )}

          <ul className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-ink ring-1 ring-bark/50"
              >
                {genre.name}
              </li>
            ))}
          </ul>

          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-soft">
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-bold text-ink">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            {movie.release_date.slice(0, 4)} · {movie.runtime} min
          </p>

          <p className="leading-relaxed text-ink/85">{movie.overview}</p>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
