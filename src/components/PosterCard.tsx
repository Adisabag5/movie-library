import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { imageUrl } from '../core/images'
import { detailsPath, displayName, type MediaItem } from '../core/media'
import { useCollection, useInCollection } from '../stores/collection'

interface PosterCardProps {
    item: MediaItem
    className?: string
    style?: CSSProperties
}

const PosterCard = ({ item, className = '', style }: PosterCardProps) => {
    const toggle = useCollection((state) => state.toggle)
    const inCollection = useInCollection(item)

    return (
        <div className={`group relative ${className}`} style={style}>
            <Link
                to={detailsPath(item)}
                className="block rounded-xl transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <div className="overflow-hidden rounded-xl bg-sand shadow-md shadow-ink/10 ring-1 ring-bark/40 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-accent/25">
                    <img
                        src={imageUrl(item.poster_path)}
                        alt={displayName(item)}
                        loading="lazy"
                        className="aspect-[2/3] w-full object-cover brightness-95 saturate-[0.95] transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-110 group-hover:saturate-110"
                    />
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-ink-soft transition-colors duration-300 group-hover:text-accent">
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
                className={`absolute right-2 top-2 rounded-full p-2 leading-none shadow-lg transition-all duration-300 hover:scale-110 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft ${
                    inCollection
                        ? 'bg-accent-soft text-ink opacity-100 shadow-accent-soft/40'
                        : 'bg-paper/85 text-ink opacity-0 shadow-ink/25 backdrop-blur-sm hover:bg-accent hover:text-paper group-hover:opacity-100 [@media(hover:none)]:opacity-100'
                }`}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    {inCollection ? (
                        <path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    )}
                </svg>
            </button>
        </div>
    )
}

export default PosterCard
