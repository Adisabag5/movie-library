import { Link, NavLink } from 'react-router-dom'
import { LogoDark } from '../icons/Logo'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'relative block rounded-full px-3.5 py-1.5 text-sm font-semibold tracking-tight',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    isActive
      ? 'bg-[linear-gradient(110deg,var(--color-accent),var(--color-accent-soft),var(--color-accent))] bg-[length:200%_100%] animate-drift text-paper shadow-sm shadow-accent/30'
      : 'text-ink-soft hover:-translate-y-0.5 hover:bg-sand hover:text-accent',
  ].join(' ')

const Toolbar = () => {
  return (
    <nav className="flex items-center justify-between gap-4">
      <Link
        to="/"
        className="group flex items-center gap-2.5 rounded-full transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >

        <LogoDark
          size={34}
          className="transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110"
        />
        <span className="hidden text-lg font-black tracking-tight text-ink sm:inline">
          Movie
          <span className="text-accent transition-colors duration-300 group-hover:text-accent-soft">
            Library
          </span>
        </span>
      </Link>

      <ul className="flex items-center gap-1">
        <li>
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/movies" className={linkClass}>
            Movies
          </NavLink>
        </li>
        <li>
          <NavLink to="/series" className={linkClass}>
            Series
          </NavLink>
        </li>
        <li>
          <NavLink to="/collections" className={linkClass}>
            Collections
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Toolbar
