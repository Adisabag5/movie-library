import { Link, NavLink } from 'react-router-dom'
import { LogoDark } from '../icons/Logo'

// NavLink passes { isActive } to a className function — that's how the
// current page gets highlighted without tracking any state ourselves.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
  }`

const Toolbar = () => {
  return (
    <nav className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
            <LogoDark size={36} />
            <span className="hidden text-lg font-bold tracking-tight sm:inline">
              Movie Library
            </span>
        </Link>

        <ul className="flex items-center gap-1">
            <li> <NavLink to="/" className={linkClass} end>Home</NavLink> </li>
            <li> <NavLink to="/movies" className={linkClass}>Movies</NavLink> </li>
            <li> <NavLink to="/series" className={linkClass}>Series</NavLink> </li>
            <li> <NavLink to="/collections" className={linkClass}>Collections</NavLink> </li>
        </ul>
    </nav>
  )
}

export default Toolbar
