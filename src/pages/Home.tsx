import Hero from '../components/Hero';
import HorizontalList from '../components/HorizontalList';
import { OfflineBanner } from '../components/ErrorMessage';
import { HeroSkeleton, RowSkeleton } from '../components/Skeletons';
import Reveal from '../components/motion/Reveal';
import {
  usePopularMovies,
  usePopularSeries,
  useTopRatedMovies,
} from '../hooks/queries';

const Home = () => {
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const popularSeries = usePopularSeries();

  const isPaused =
    popularMovies.isPaused || topRatedMovies.isPaused || popularSeries.isPaused;

  if (isPaused) {
    return <OfflineBanner />;
  }

  return (
    <div className="space-y-10">
      <title>Movie Library — Browse films and series</title>

      {/* Visually hidden, not absent. The hero is the visual focus, so a large
          "Movie Library" heading would fight the design — but without an h1 the
          landing page has no top-level label in the accessibility tree, and its
          headings start at h2. sr-only keeps the outline intact. */}
      <h1 className="sr-only">Movie Library — browse popular films and series</h1>

      <Reveal>
        {
          popularMovies?.isPending ?
            <HeroSkeleton /> :
              popularMovies.isError ?
                <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load movies. Please try again later.</p> :
                  <Hero movies={popularMovies.data} />
        }
      </Reveal>

      <Reveal>
        {
          popularMovies?.isPending ?
            <RowSkeleton /> :
              popularMovies.isError ?
                  <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load movies. Please try again later.</p> :
                    <HorizontalList title="Movies" list={popularMovies.data} />
        }
      </Reveal>

      <Reveal delay={80}>
        {
          popularSeries?.isPending ?
            <RowSkeleton /> :
                popularSeries.isError ?
                  <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load series. Please try again later.</p> :
                    <HorizontalList title="Series" list={popularSeries.data} />
        }
      </Reveal>

      <Reveal delay={160}>
        {
          topRatedMovies?.isPending ?
            <RowSkeleton /> :
                topRatedMovies.isError ?
                  <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load movies. Please try again later.</p> :
                    <HorizontalList title="Top Rated" list={topRatedMovies.data} />
        }
      </Reveal>

    </div>
  );
};

export default Home;
