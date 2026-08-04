import FilterDropdown from './FilterDropdown'
import ResetFiltersButton from './ResetFiltersButton'
import { isActive } from '../../core/filterValues'
import type { FilterField, FilterValue, FilterValues } from '../../types/filters'

export interface FilterBarProps<Name extends string = string> {
    fields: FilterField<Name>[]
    values: FilterValues<Name>
    onChange: (name: Name, value: FilterValue) => void
    onReset?: () => void
    isBusy?: boolean
    isDisabled?: boolean
    disabledHint?: string
}

const FilterBar = <Name extends string>({
    fields,
    values,
    onChange,
    onReset,
    isBusy = false,
    isDisabled = false,
    disabledHint,
}: FilterBarProps<Name>) => {
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
