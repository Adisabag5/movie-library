// Skeletons mirror the shape of the real content, so the page doesn't
// jump when data arrives — far better perceived performance than a
// spinner or "Loading…" text.

export const HeroSkeleton = () => (
  <div className="min-h-[24rem] animate-pulse rounded-2xl bg-zinc-900 md:min-h-[28rem]" />
)

export const DetailsSkeleton = () => (
  <div className="flex flex-col gap-8 md:flex-row">
    <div className="aspect-[2/3] w-64 shrink-0 animate-pulse self-center rounded-2xl bg-zinc-900 md:self-start" />
    <div className="flex-1 space-y-4">
      <div className="h-10 w-2/3 animate-pulse rounded bg-zinc-900" />
      <div className="h-5 w-1/3 animate-pulse rounded bg-zinc-900" />
      <div className="h-24 w-full animate-pulse rounded bg-zinc-900" />
    </div>
  </div>
)

export const RowSkeleton = () => (
  <section className="space-y-3">
    <div className="h-6 w-32 animate-pulse rounded bg-zinc-900" />
    <div className="flex gap-4 overflow-hidden pb-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="w-28 shrink-0 md:w-36">
          <div className="aspect-[2/3] animate-pulse rounded-lg bg-zinc-900" />
        </div>
      ))}
    </div>
  </section>
)
