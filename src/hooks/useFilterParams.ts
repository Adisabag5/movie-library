import { useUrlParams } from './useUrlParams'
import type { FilterField, FilterValue, FilterValues } from '../types/filters'

export interface UseFilterParamsOptions<Name extends string> {
    fields: FilterField<Name>[]
}

export interface UseFilterParams<Name extends string> {
    values: FilterValues<Name>
    setFilter: (name: Name, value: FilterValue) => void
    reset: () => void
}

/**
 * URL-backed filter state. Generic over the field names so `values` is keyed
 * by the union the caller declared rather than by bare `string`.
 *
 * A multi-value field is comma-joined on write and split on read — the two
 * halves have to stay symmetric, which is why they live in one file.
 */
export function useFilterParams<Name extends string>({
    fields,
}: UseFilterParamsOptions<Name>): UseFilterParams<Name> {
    const { searchParams, update } = useUrlParams()

    const values = fields.reduce<FilterValues<Name>>((acc, field) => {
        const raw = searchParams.get(field.name)
        if (!raw) return acc
        return { ...acc, [field.name]: field.multiple ? raw.split(',') : raw }
    }, {})

    const setFilter = (name: Name, value: FilterValue) => {
        update((next) => {
            const encoded = Array.isArray(value) ? value.join(',') : (value ?? '')

            // Delete rather than set '', so the key leaves the URL entirely
            // instead of lingering as a dangling `?genre=`.
            if (encoded) next.set(name, encoded)
            else next.delete(name)
        })
    }

    const reset = () => {
        // Driven by fields, not by the current values, so a key still in the
        // URL but not currently active is cleared too.
        update((next) => fields.forEach((field) => next.delete(field.name)))
    }

    return { values, setFilter, reset }
}
