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

export function useFilterParams<Name extends string>({
    fields,
}: UseFilterParamsOptions<Name>): UseFilterParams<Name> {
    const { searchParams, update } = useUrlParams()

    const values = fields.reduce<FilterValues<Name>>((acc, field) => {
        const raw = searchParams.get(field.name)
        return !raw ? acc : { ...acc, [field.name]: field.multiple ? raw.split(',') : raw }
    }, {})

    const setFilter = (name: Name, value: FilterValue) => {
        update((next) => {
            const encoded = Array.isArray(value) ? value.join(',') : (value ?? '')
            if (encoded) next.set(name, encoded)
            else next.delete(name)
        })
    }

    const reset = () => update((next) => fields.forEach((field) => next.delete(field.name)))

    return { values, setFilter, reset }
}
