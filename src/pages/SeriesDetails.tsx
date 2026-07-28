import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import ErrorMessage, { OfflineBanner } from '../components/ErrorMessage';
import { DetailsSkeleton } from '../components/Skeletons';
import { imageUrl } from '../core/images';
import { useSeriesDetails } from '../hooks/queries';

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: series, isPending, isError, isPaused, refetch } = useSeriesDetails(id!);

  if (isPaused) {
    return <OfflineBanner />;
  }

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message="Could not load this series."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="animate-fade-up">
      <BackButton fallback="/series" label="All series" />

      <section className="flex flex-col gap-8 md:flex-row">
        {series.poster_path && (
          <img
            src={imageUrl(series.poster_path, 'w500')}
            alt={series.name}
            className="w-64 shrink-0 self-center rounded-2xl shadow-xl shadow-ink/20 ring-1 ring-bark/50 md:self-start"
          />
        )}

        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-ink">{series.name}</h1>

          {series.tagline && (
            <p className="text-lg italic text-clay-deep">{series.tagline}</p>
          )}

          <ul className="flex flex-wrap gap-2">
            {series.genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-ink ring-1 ring-bark/50"
              >
                {genre.name}
              </li>
            ))}
          </ul>

          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-soft">
            <span className="rounded-full bg-marigold px-2.5 py-0.5 font-bold text-ink">
              ★ {series.vote_average.toFixed(1)}
            </span>
            {series.first_air_date.slice(0, 4)} · {series.number_of_seasons}{' '}
            {series.number_of_seasons === 1 ? 'season' : 'seasons'} ·{' '}
            {series.number_of_episodes} episodes
          </p>

          <p className="leading-relaxed text-ink/85">{series.overview}</p>
        </div>
      </section>
    </div>
  );
};

export default SeriesDetails;
