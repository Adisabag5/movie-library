import { toArray, toSingle } from './filterValues'
import type { FilterName, MediaKind } from './filters'
import type { FilterValues } from '../types/filters'

/**
 * Ticking several genres reads as "any of these", so they are OR-joined.
 * TMDB uses a pipe for OR and a comma for AND — a comma here would mean
 * "Action AND Drama", which is a much narrower result set than the checkbox
 * list implies. Swap to ',' if you want the intersection instead.
 */
const GENRE_SEPARATOR = '|'

/**
 * Turns filter values into the query string for TMDB's /discover endpoints.
 * The value encodings it expects are the ones defined in core/filters.ts —
 * change an option's format there and this has to follow.
 *
 * Returns only the filter portion: page, language and anything else the
 * request needs stay with the fetcher.
 */
export function toDiscoverQuery(
    values: FilterValues<FilterName>,
    kind: MediaKind
): string {
    const params = new URLSearchParams()

    const rating = toSingle(values.rating ?? null)
    if (rating) params.set('vote_average.gte', rating)

    // Encoded "min-max" in minutes, e.g. "90-120".
    const duration = toSingle(values.duration ?? null)
    if (duration) {
        const [min, max] = duration.split('-')
        if (min) params.set('with_runtime.gte', min)
        if (max) params.set('with_runtime.lte', max)
    }

    // Movies and series name this parameter differently.
    const year = toSingle(values.year ?? null)
    if (year) {
        params.set(kind === 'movie' ? 'primary_release_year' : 'first_air_date_year', year)
    }

    const genres = toArray(values.genre ?? null)
    if (genres.length > 0) params.set('with_genres', genres.join(GENRE_SEPARATOR))

    return params.toString()
}
