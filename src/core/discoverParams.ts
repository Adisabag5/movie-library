import { toArray, toSingle } from './filterValues'
import type { FilterName, MediaKind } from './filters'
import type { FilterValues } from '../types/filters'

const GENRE_SEPARATOR = '|'

export function toDiscoverQuery(
    values: FilterValues<FilterName>,
    kind: MediaKind
): string {
    const params = new URLSearchParams()

    const rating = toSingle(values.rating ?? null)
    if (rating) params.set('vote_average.gte', rating)

    const duration = toSingle(values.duration ?? null)
    if (duration) {
        const [min, max] = duration.split('-')
        if (min) params.set('with_runtime.gte', min)
        if (max) params.set('with_runtime.lte', max)
    }

    const year = toSingle(values.year ?? null)
    if (year) {
        params.set(kind === 'movie' ? 'primary_release_year' : 'first_air_date_year', year)
    }

    const genres = toArray(values.genre ?? null)
    if (genres.length > 0) params.set('with_genres', genres.join(GENRE_SEPARATOR))

    return params.toString()
}
