import Chevron from '../icons/Chevron'

interface PaginationProps {
    page: number;
    totalPages: number;

    isBusy?: boolean;
    onPageChange: (page: number) => void;
}

// Icon-only, so the accessible name has to come from aria-label — without it
// these are two unlabelled buttons to a screen reader.
const buttonClass =
    'flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-30'

const Pagination = ({ page, totalPages, isBusy = false, onPageChange }: PaginationProps) => {
    return (
        <nav aria-label="Pagination" aria-busy={isBusy} className="flex items-center justify-center gap-2">

            <button
                type="button"
                aria-label="Previous page"
                title="Previous page"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className={buttonClass}
            >
                <Chevron className="h-3.5 w-3.5 rotate-90" />
            </button>

            <span aria-live="polite" className="min-w-28 text-center text-sm font-semibold text-ink-soft">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                aria-label="Next page"
                title="Next page"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className={buttonClass}
            >
                <Chevron className="h-3.5 w-3.5 -rotate-90" />
            </button>
        </nav>
    )
}

export default Pagination
