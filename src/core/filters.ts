import type { FilterField, FilterOption } from '../types/filters'

export type MediaKind = 'movie' | 'tv'

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

export const RATING_OPTIONS: FilterOption[] = [
    { value: '9', label: '9+ Exceptional' },
    { value: '8', label: '8+ Great' },
    { value: '7', label: '7+ Good' },
    { value: '6', label: '6+ Watchable' },
    { value: '5', label: '5+ Mixed' },
]

export const DURATION_OPTIONS: FilterOption[] = [
    { value: '0-90', label: 'Under 90 min' },
    { value: '90-120', label: '90 – 120 min' },
    { value: '120-150', label: '2 – 2½ hours' },
    { value: '150-999', label: 'Over 2½ hours' },
]

export function yearOptions(span = 50): FilterOption[] {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: span }, (_, index) => {
        const year = String(currentYear - index)
        return { value: year, label: year }
    })
}

export const FILTER_NAMES = ['rating', 'duration', 'year', 'genre'] as const

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

const FIELDS: Record<MediaKind, FilterField<FilterName>[]> = {
    movie: fieldsFor('movie'),
    tv: fieldsFor('tv'),
}

export function buildFilterFields(kind: MediaKind): FilterField<FilterName>[] {
    return FIELDS[kind]
}
