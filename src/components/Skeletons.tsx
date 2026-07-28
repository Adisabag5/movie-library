const block = 'animate-shimmer bg-gradient-to-br from-sand via-linen to-sand'

export const HeroSkeleton = () => (
  <div className={`min-h-[30rem] rounded-[2rem] ring-1 ring-bark/40 md:min-h-[34rem] ${block}`} />
)

export const DetailsSkeleton = () => (
  <div className="flex flex-col gap-8 md:flex-row">
    <div className={`aspect-[2/3] w-64 shrink-0 self-center rounded-2xl md:self-start ${block}`} />
    <div className="flex-1 space-y-4">
      <div className={`h-10 w-2/3 rounded-lg ${block}`} />
      <div className={`h-5 w-1/3 rounded-lg ${block}`} />
      <div className={`h-24 w-full rounded-lg ${block}`} />
    </div>
  </div>
)

export const GridSkeleton = () => (
  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
    {Array.from({ length: 18 }, (_, i) => (
      <div key={i} className={`aspect-[2/3] rounded-xl ${block}`} />
    ))}
  </div>
)

export const RowSkeleton = () => (
  <section className="space-y-4">
    <div className="flex items-center gap-4">
      <div className={`h-6 w-32 shrink-0 rounded-lg ${block}`} />
      <span className="h-px flex-1 bg-bark/50" />
    </div>
    <div className="flex gap-4 overflow-hidden pb-3">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="w-28 shrink-0 md:w-36">
          <div className={`aspect-[2/3] rounded-xl ${block}`} />
        </div>
      ))}
    </div>
  </section>
)
