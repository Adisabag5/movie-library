interface PaginationProps {
    page: number;
    totalPages: number;
    /** Disables Next while the next page is still loading */
    isBusy?: boolean;
    onPageChange: (page: number) => void;
}

const buttonClass =
    'rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40'

const Pagination = ({ page, totalPages, isBusy = false, onPageChange }: PaginationProps) => {
    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-4">
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={buttonClass}>
                ← Prev
            </button>

            <span className="text-sm text-zinc-400">
                Page {page} of {totalPages}
            </span>

            <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages || isBusy} className={buttonClass}>
                Next →
            </button>
        </nav>
    )
}

export default Pagination
