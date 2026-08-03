import SelectionTick from './SelectionTick'
import type { FilterOption } from '../../types/filters'

interface FilterOptionRowProps {
    option: FilterOption
    checked: boolean
    multiple: boolean
    /** Ties the radios of one field together. Unused when multiple. */
    groupName?: string
    onSelect: () => void
}

/**
 * The native input stays in the DOM but is visually hidden: it carries the
 * semantics, keyboard behaviour and focus, while the sibling span does the
 * drawing. Checked state is driven from React rather than a peer-checked
 * variant, because the tick is a *descendant* of that sibling and CSS sibling
 * combinators cannot reach it.
 */
const FilterOptionRow = ({
    option,
    checked,
    multiple,
    groupName,
    onSelect,
}: FilterOptionRowProps) => (
    <label className="block">
        <input
            type={multiple ? 'checkbox' : 'radio'}
            name={multiple ? undefined : groupName}
            value={option.value}
            checked={checked}
            onChange={onSelect}
            className="peer sr-only"
        />
        <span
            className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay ${
                checked ? 'bg-clay/10 text-clay-deep' : 'text-ink-soft hover:bg-sand'
            }`}
        >
            <SelectionTick checked={checked} round={!multiple} />
            <span className="truncate">{option.label}</span>
        </span>
    </label>
)

export default FilterOptionRow
