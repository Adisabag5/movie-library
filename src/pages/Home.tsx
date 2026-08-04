import Hero from '../components/Hero';
import HorizontalList from '../components/HorizontalList';
import { OfflineBanner } from '../components/ErrorMessage';
import QueryState from '../components/QueryState';
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

  // Being offline is a property of the page, not of each row — so it is
  // announced once, ABOVE the content, and never instead of it. Whatever any
  // row already has stays on screen.
  const isPaused =
    popularMovies.isPaused || topRatedMovies.isPaused || popularSeries.isPaused;

  return (
    <div className="space-y-10">
      <title>Movie Library — Browse films and series</title>

      {/* Visually hidden, not absent. The hero is the visual focus, so a large
          "Movie Library" heading would fight the design — but without an h1 the
          landing page has no top-level label in the accessibility tree, and its
          headings start at h2. sr-only keeps the outline intact. */}
      <h1 className="sr-only">Movie Library — browse popular films and series</h1>

      {isPaused && <OfflineBanner />}

      {/* Each section resolves on its own. There is deliberately no aggregate
          isPending/isError/isPaused across the three queries: one slow or
          failing request must not blank the other two. */}
      <QueryState
        query={popularMovies}
        skeleton={<HeroSkeleton />}
        errorMessage="Could not load the featured film."
      >
        {(movies) => (
          <Reveal>
            <Hero movies={movies} />
          </Reveal>
        )}
      </QueryState>

      <QueryState
        query={popularMovies}
        skeleton={<RowSkeleton />}
        errorMessage="Could not load movies."
      >
        {(movies) => (
          <Reveal>
            <HorizontalList title="Movies" list={movies} />
          </Reveal>
        )}
      </QueryState>

      <QueryState
        query={popularSeries}
        skeleton={<RowSkeleton />}
        errorMessage="Could not load series."
      >
        {(series) => (
          <Reveal delay={80}>
            <HorizontalList title="Series" list={series} />
          </Reveal>
        )}
      </QueryState>

      <QueryState
        query={topRatedMovies}
        skeleton={<RowSkeleton />}
        errorMessage="Could not load top rated movies."
      >
        {(movies) => (
          <Reveal delay={160}>
            <HorizontalList title="Top Rated" list={movies} />
          </Reveal>
        )}
      </QueryState>
    </div>
  );
};

export default Home;
