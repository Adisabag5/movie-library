import { useId, useState } from 'react'
import FilterOptionRow from './FilterOptionRow'
import Chevron from '../../icons/Chevron'
import {
    emptyLabelFor,
    listOrNull,
    orNull,
    toArray,
    toggleValue,
    toSingle,
} from '../../core/filterValues'
import { useDismiss } from '../../hooks/useDismiss'
import type { FilterField, FilterValue } from '../../types/filters'

interface FilterDropdownProps {
    field: FilterField
    value: FilterValue
    onChange: (value: FilterValue) => void
    disabled?: boolean
}

const FilterDropdown = ({ field, value, onChange, disabled = false }: FilterDropdownProps) => {
    const [open, setOpen] = useState(false)
    const rootRef = useDismiss<HTMLDivElement>(open, () => setOpen(false))
    const panelId = useId()
    const groupName = useId()

    const multiple = field.multiple ?? false
    const selected = toArray(value)
    const current = toSingle(value)

    const labelOf = (optionValue: string) =>
        field.options.find((option) => option.value === optionValue)?.label

    const summary = multiple
        ? selected.length === 0
            ? emptyLabelFor(field)
            : selected.length === 1
              ? (labelOf(selected[0] ?? '') ?? '1 selected')
              : `${selected.length} selected`
        : (labelOf(current) ?? emptyLabelFor(field))

    const isActive = multiple ? selected.length > 0 : current !== ''

    const rows = multiple
        ? field.options
        : [{ value: '', label: emptyLabelFor(field) }, ...field.options]

    const select = (optionValue: string) => {
        if (multiple) {
            onChange(listOrNull(toggleValue(selected, optionValue)))
            return
        }
        onChange(orNull(optionValue))

        setOpen(false)
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label={field.label}
                aria-expanded={open}
                aria-controls={panelId}
                aria-disabled={disabled}
                onClick={() => {
                    if (disabled) return
                    setOpen((previous) => !previous)
                }}
                className={`relative h-9 w-full truncate rounded-lg border bg-paper py-0 pl-3 pr-8 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-disabled:cursor-not-allowed ${
                    disabled ? 'border-bark text-ink-soft' : 'cursor-pointer'
                } ${
                    isActive && !disabled
                        ? 'border-accent text-accent-deep'
                        : !disabled
                          ? 'border-bark text-ink-soft hover:border-accent hover:text-accent'
                          : ''
                }`}
            >
                {summary}
                <Chevron
                    className={`pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-accent transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div
                    id={panelId}
                    role={multiple ? 'group' : 'radiogroup'}
                    aria-label={field.label}
                    className="absolute left-0 z-30 mt-1 max-h-64 w-60 overflow-y-auto rounded-xl border border-bark bg-paper p-1.5 shadow-xl shadow-ink/15"
                >
                    {rows.map((option) => (
                        <FilterOptionRow
                            key={option.value}
                            option={option}
                            multiple={multiple}
                            groupName={groupName}
                            checked={
                                multiple
                                    ? selected.includes(option.value)
                                    : current === option.value
                            }
                            onSelect={() => select(option.value)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default FilterDropdown
