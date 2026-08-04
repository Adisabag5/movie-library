import type { FilterField, FilterOption } from '../types/filters'

export type MediaKind = 'movie' | 'tv'

/**
 * Fetched from /genre/movie/list and /genre/tv/list. The two lists are NOT
 * interchangeable — movies have Action (28) and Fantasy (14); TV has neither,
 * carrying Action & Adventure (10759) and Sci-Fi & Fantasy (10765) instead.
 * Only 8 ids appear in both. That is why the fields are built per media kind.
 *
 * These are stable enough to hardcode, but the API is the source of truth. A
 * `/genre/{kind}/list` query with a long staleTime would remove the risk of
 * this list drifting.
 */
const MOVIE_GENRES: FilterOption[] = [
    { value: '28', label: 'Action' },
    { value: '12', label: 'Adventure' },
    { value: '16', label: 'Animation' },
    { value: '35', label: 'Comedy' },
    { value: '80', label: 'Crime' },
    { value: '99', label: 'Documentary' },
    { value: '18', label: 'Drama' },
    { value: '10751', label: 'Family' },
    { value: '14', label: 'Fantasy' },
    { value: '36', label: 'History' },
    { value: '27', label: 'Horror' },
    { value: '10402', label: 'Music' },
    { value: '9648', label: 'Mystery' },
    { value: '10749', label: 'Romance' },
    { value: '878', label: 'Science Fiction' },
    { value: '10770', label: 'TV Movie' },
    { value: '53', label: 'Thriller' },
    { value: '10752', label: 'War' },
    { value: '37', label: 'Western' },
]

const TV_GENRES: FilterOption[] = [
    { value: '10759', label: 'Action & Adventure' },
    { value: '16', label: 'Animation' },
    { value: '35', label: 'Comedy' },
    { value: '80', label: 'Crime' },
    { value: '99', label: 'Documentary' },
    { value: '18', label: 'Drama' },
    { value: '10751', label: 'Family' },
    { value: '10762', label: 'Kids' },
    { value: '9648', label: 'Mystery' },
    { value: '10763', label: 'News' },
    { value: '10764', label: 'Reality' },
    { value: '10765', label: 'Sci-Fi & Fantasy' },
    { value: '10766', label: 'Soap' },
    { value: '10767', label: 'Talk' },
    { value: '10768', label: 'War & Politics' },
    { value: '37', label: 'Western' },
]

/**
 * A minimum score, not a band. TMDB exposes `vote_average.gte`, so overlapping
 * choices cannot be combined — picking "7+" and "8+" would just mean "7+".
 * Maps to: vote_average.gte=<value>
 */
export const RATING_OPTIONS: FilterOption[] = [
    { value: '9', label: '9+ Exceptional' },
    { value: '8', label: '8+ Great' },
    { value: '7', label: '7+ Good' },
    { value: '6', label: '6+ Watchable' },
    { value: '5', label: '5+ Mixed' },
]

/**
 * Runtime bands in minutes, encoded "min-max" so a consumer can split on '-'.
 * Maps to: with_runtime.gte / with_runtime.lte
 * TMDB takes one range, so these are mutually exclusive.
 */
export const DURATION_OPTIONS: FilterOption[] = [
    { value: '0-90', label: 'Under 90 min' },
    { value: '90-120', label: '90 – 120 min' },
    { value: '120-150', label: '2 – 2½ hours' },
    { value: '150-999', label: 'Over 2½ hours' },
]

/**
 * Generated rather than hardcoded so the list never goes stale.
 * Maps to: primary_release_year (movies) / first_air_date_year (tv)
 */
export function yearOptions(span = 50): FilterOption[] {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: span }, (_, index) => {
        const year = String(currentYear - index)
        return { value: year, label: year }
    })
}

/**
 * Genre is the only one of these that is genuinely multi-select: TMDB's
 * `with_genres` accepts several ids (comma for AND, pipe for OR). Rating,
 * duration and year each map to a single parameter or range, so offering
 * multiple values would produce a query the API cannot express.
 */
export const FILTER_NAMES = ['rating', 'duration', 'year', 'genre'] as const

/** The query-string keys these fields own. */
export type FilterName = (typeof FILTER_NAMES)[number]

const fieldsFor = (kind: MediaKind): FilterField<FilterName>[] => [
    { name: 'rating', label: 'Rating', options: RATING_OPTIONS },
    { name: 'duration', label: 'Duration', options: DURATION_OPTIONS },
    { name: 'year', label: 'Year', options: yearOptions() },
    {
        name: 'genre',
        label: 'Genre',
        multiple: true,
        options: kind === 'movie' ? MOVIE_GENRES : TV_GENRES,
    },
]

// Built once at module load rather than per render. Calling this from a
// component body re-created 50 year options and a fresh array identity on
// every keystroke, which also defeated any memoisation downstream. The result
// depends only on `kind`, so there are exactly two of them.
const FIELDS: Record<MediaKind, FilterField<FilterName>[]> = {
    movie: fieldsFor('movie'),
    tv: fieldsFor('tv'),
}

export function buildFilterFields(kind: MediaKind): FilterField<FilterName>[] {
    return FIELDS[kind]
}
