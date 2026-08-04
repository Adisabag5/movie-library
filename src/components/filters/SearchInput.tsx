import { useEffect, useId, useRef, useState } from 'react'
import CloseIcon from '../../icons/CloseIcon'
import SearchIcon from '../../icons/SearchIcon'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

export interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    isBusy?: boolean
    delay?: number
}

const SearchInput = ({
    value,
    onChange,
    label = 'Search',
    placeholder = 'Search titles',
    isBusy = false,
    delay = 350,
}: SearchInputProps) => {
    const [draft, setDraft] = useState(value)
    const inputId = useId()
    const debounced = useDebouncedValue(draft, delay)

    const latestOnChange = useRef(onChange)
    useEffect(() => {
        latestOnChange.current = onChange
    })

    const committed = useRef(value)

    const commit = (next: string) => {
        committed.current = next
        latestOnChange.current(next)
    }

    useEffect(() => {
        if (debounced === committed.current) return
        commit(debounced)
    }, [debounced])

    useEffect(() => {
        if (value === committed.current) return
        committed.current = value
        setDraft(value)
    }, [value])

    const clear = () => {
        setDraft('')
        commit('')
    }

    return (
        <div className="relative w-44">
            <label htmlFor={inputId} className="sr-only">
                {label}
            </label>

            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-accent" />

            <input
                id={inputId}
                type="search"
                value={draft}
                placeholder={placeholder}
                aria-busy={isBusy}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        commit(draft)
                    }
                }}
                className={`h-9 w-full rounded-lg border bg-paper pl-9 pr-8 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-ink-soft transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-search-cancel-button]:appearance-none ${
                    draft ? 'border-accent' : 'border-bark hover:border-accent'
                }`}
            />

            {draft && (
                <button
                    type="button"
                    onClick={clear}
                    aria-label="Clear search"
                    title="Clear search"
                    className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <CloseIcon className="h-2.5 w-2.5" />
                </button>
            )}
        </div>
    )
}

export default SearchInput
