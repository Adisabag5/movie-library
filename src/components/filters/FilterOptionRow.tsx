import SelectionTick from './SelectionTick'
import type { FilterOption } from '../../types/filters'

interface FilterOptionRowProps {
    option: FilterOption
    checked: boolean
    multiple: boolean
    groupName?: string
    onSelect: () => void
}

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
            className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                checked ? 'bg-accent/10 text-accent-deep' : 'text-ink-soft hover:bg-sand'
            }`}
        >
            <SelectionTick checked={checked} round={!multiple} />
            <span className="truncate">{option.label}</span>
        </span>
    </label>
)

export default FilterOptionRow
