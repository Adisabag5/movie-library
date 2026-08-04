import CheckIcon from '../../icons/CheckIcon'

interface SelectionTickProps {
    checked: boolean
    round: boolean
}

const SelectionTick = ({ checked, round }: SelectionTickProps) => (
    <span
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center border-2 transition-all duration-200 ${
            round ? 'rounded-full' : 'rounded-[0.3rem]'
        } ${checked ? 'border-accent bg-accent' : 'border-bark bg-paper'}`}
    >
        {round ? (
            <span
                className={`h-1.5 w-1.5 rounded-full bg-paper transition-opacity duration-200 ${
                    checked ? 'opacity-100' : 'opacity-0'
                }`}
            />
        ) : (
            <CheckIcon
                className={`h-2.5 w-2.5 text-paper transition-opacity duration-200 ${
                    checked ? 'opacity-100' : 'opacity-0'
                }`}
            />
        )}
    </span>
)

export default SelectionTick
