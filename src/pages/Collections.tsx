import { Link } from 'react-router-dom'
import PosterGrid from '../components/PosterGrid'
import Reveal from '../components/motion/Reveal'
import { useCollection } from '../stores/collection'

const Collections = () => {
  const items = useCollection((state) => state.items)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-ink">My Collection</h1>

      {items.length === 0 ? (
        <div className="space-y-3 py-24 text-center text-ink-soft">
          <p className="font-semibold">Your collection is empty.</p>
          <p className="text-sm">
            Browse{' '}
            <Link
              to="/movies"
              className="font-semibold text-accent-deep underline underline-offset-4 transition-colors hover:text-accent"
            >
              movies
            </Link>{' '}
            or{' '}
            <Link
              to="/series"
              className="font-semibold text-accent-deep underline underline-offset-4 transition-colors hover:text-accent"
            >
              series
            </Link>{' '}
            and hit the + button on anything you like.
          </p>
        </div>
      ) : (
        <Reveal>
          <PosterGrid list={items} />
        </Reveal>
      )}
    </div>
  )
}

export default Collections
