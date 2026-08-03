import PosterCard from './PosterCard'
import { mediaKey, type MediaItem } from '../core/media'

const HorizontalList = ({ title, list }: { title: string; list: MediaItem[] }) => {
    return (
        <section className="space-y-4">

            <div className="flex items-center gap-4">
                <h2 className="shrink-0 text-xl font-black tracking-tight text-ink">
                    {title}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-accent/50 via-bark/60 to-transparent" />
            </div>

            <div className="scroll-rail -mx-1 flex snap-x gap-4 overflow-x-auto px-1 py-3">
                {list.map((i, index) => (
                    <PosterCard
                        key={mediaKey(i)}
                        item={i}
                        className="w-28 shrink-0 snap-start animate-fade-up md:w-36"
                        style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
                    />
                ))}
            </div>
        </section>
    )
}

export default HorizontalList
