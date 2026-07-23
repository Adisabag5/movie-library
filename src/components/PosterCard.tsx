import { Link } from 'react-router-dom'
import { imageUrl } from '../core/images'
import type { Movie } from '../types/movie'
import type { Series } from '../types/series'

// Movies have `title`, series have `name` — the `in` check tells
// TypeScript which of the two we are holding (union narrowing).
const displayName = (item: Movie | Series) =>
    'title' in item ? item.title : item.name

const detailsPath = (item: Movie | Series) =>
    'title' in item ? `/movie/${item.id}` : `/series/${item.id}`

// One poster card, two layouts: HorizontalList passes fixed widths,
// the browse grids let the grid column set the width.
// The collection button is a sibling of the Link, not a child —
// nesting a button inside a link is invalid HTML.
const PosterCard = ({ item, className = '' }: { item: Movie | Series; className?: string }) => {
    return (
        <div className={`group relative ${className}`}>
            <Link
                to={detailsPath(item)}
                className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={imageUrl(item.poster_path)}
                        alt={displayName(item)}
                        loading="lazy"
                        className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </div>
                <p className="mt-2 truncate text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">
                    {displayName(item)}
                </p>
            </Link>

            <button
                type="button"
                aria-label={`Add ${displayName(item)} to collection`}
                title="Add to collection"
                onClick={() => {
                    // TODO: wire up to the collections feature
                }}
                className="absolute right-2 top-2 rounded-full bg-zinc-950/70 p-2 leading-none opacity-0 transition hover:bg-red-600 focus-visible:opacity-100 group-hover:opacity-100"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    )
}

export default PosterCard
