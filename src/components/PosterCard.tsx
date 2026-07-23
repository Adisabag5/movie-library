import { Link } from 'react-router-dom'
import { imageUrl } from '../core/images'
import { detailsPath, displayName, type MediaItem } from '../core/media'
import { useCollection, useInCollection } from '../stores/collection'

// One poster card, two layouts: HorizontalList passes fixed widths,
// the browse grids let the grid column set the width.
// The collection button is a sibling of the Link, not a child —
// nesting a button inside a link is invalid HTML.
const PosterCard = ({ item, className = '' }: { item: MediaItem; className?: string }) => {
    const toggle = useCollection((state) => state.toggle)
    const inCollection = useInCollection(item)

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
                aria-pressed={inCollection}
                aria-label={
                    inCollection
                        ? `Remove ${displayName(item)} from collection`
                        : `Add ${displayName(item)} to collection`
                }
                title={inCollection ? 'Remove from collection' : 'Add to collection'}
                onClick={() => toggle(item)}
                className={`absolute right-2 top-2 rounded-full p-2 leading-none transition focus-visible:opacity-100 ${
                    inCollection
                        ? 'bg-red-600 opacity-100'
                        : 'bg-zinc-950/70 opacity-0 hover:bg-red-600 group-hover:opacity-100'
                }`}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    {inCollection ? (
                        <path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    )}
                </svg>
            </button>
        </div>
    )
}

export default PosterCard
