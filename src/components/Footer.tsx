import { Link } from 'react-router-dom'
import { LogoDark } from '../icons/Logo'

const links = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/series', label: 'Series' },
    { to: '/collections', label: 'Collections' },
]

const Footer = () => {
    return (
        <footer className="mt-16 border-t border-bark/60 bg-sand/40">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 md:flex-row md:justify-between md:px-6">
                <Link
                    to="/"
                    className="group flex items-center gap-2 rounded-full transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <LogoDark size={24} className="transition-transform duration-500 group-hover:-rotate-6" />
                    <span className="text-sm font-black tracking-tight text-ink">
                        Movie<span className="text-accent">Library</span>
                    </span>
                </Link>

                <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                    {links.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className="text-sm font-semibold text-ink-soft transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <p className="group flex items-center gap-1.5 text-sm text-ink-soft">
                    Built with
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="text-accent transition-transform duration-300 group-hover:scale-125"
                    >
                        <path d="M12 21s-7.5-4.7-9.6-9A5.4 5.4 0 0 1 12 6.2 5.4 5.4 0 0 1 21.6 12c-2.1 4.3-9.6 9-9.6 9Z" />
                    </svg>
                    <span className="sr-only">love</span>
                    using TMDB
                </p>
            </div>
        </footer>
    )
}

export default Footer
