import ResetIcon from '../../icons/ResetIcon'

const ResetFiltersButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label="Clear all filters"
        title="Clear all filters"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-ink-soft transition-colors duration-200 hover:border-bark hover:bg-sand hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
        <ResetIcon className="h-4 w-4" />
    </button>
)

export default ResetFiltersButton
