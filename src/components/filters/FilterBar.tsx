import FilterDropdown from './FilterDropdown'
import ResetFiltersButton from './ResetFiltersButton'
import { isActive } from '../../core/util'
import type { FilterField, FilterValue } from '../../types/filters'

export interface FilterBarProps {
    fields: FilterField[]
    values: Record<string, FilterValue>
    onChange: (name: string, value: FilterValue) => void
    onReset?: () => void
    isBusy?: boolean
    /**
     * Set while a search is running. TMDB's /search endpoint ignores every
     * discover parameter, so the controls are turned off rather than left
     * looking usable while doing nothing.
     */
    isDisabled?: boolean
    /** Explains the disabled state instead of leaving it unexplained. */
    disabledHint?: string
}

const FilterBar = ({
    fields,
    values,
    onChange,
    onReset,
    isBusy = false,
    isDisabled = false,
    disabledHint,
}: FilterBarProps) => {
    const activeCount = fields.filter((field) => isActive(values[field.name] ?? null)).length

    return (
        <form
            aria-label="Filters"
            aria-busy={isBusy}
            className={`flex flex-wrap items-center gap-2 transition-opacity duration-300 ${
                isBusy || isDisabled ? 'opacity-60' : ''
            }`}
        >
            {fields.map((field) => (
                <div key={field.name} className="w-44">
                    <FilterDropdown
                        field={field}
                        value={values[field.name] ?? null}
                        onChange={(next) => onChange(field.name, next)}
                        disabled={isDisabled}
                    />
                </div>
            ))}

            {onReset && activeCount > 0 && !isDisabled && (
                <ResetFiltersButton onClick={onReset} />
            )}

            {isDisabled && disabledHint && (
                <p role="status" className="text-sm font-medium text-ink-soft">
                    {disabledHint}
                </p>
            )}
        </form>
    )
}

export default FilterBar
