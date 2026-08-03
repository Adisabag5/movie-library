import { useSearchParams } from 'react-router-dom'
import type { FilterField, FilterValue } from '../types/filters'

export interface UseFilterParamsOptions {
    fields: FilterField[];
}

export interface UseFilterParams {
    values: Record<string, FilterValue>
    setFilter: (name: string, value: FilterValue) => void
    reset: () => void
}

export function useFilterParams(_options: UseFilterParamsOptions): UseFilterParams {
    const [searchParams, setSearchParams] = useSearchParams();
    const { fields } = _options;

    const values: Record<string, FilterValue> = fields.reduce((acc, field) => {
        const value = searchParams.get(field.name);
        return value ? { ...acc, [field.name]: field.multiple ? value.split(',') : value } : acc;
    }, {});

    const setFilter = (name: string, value: FilterValue) => {
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            const encoded = Array.isArray(value) ? value.join(',') : (value ?? '');

            if (encoded) next.set(name, encoded);
            else next.delete(name);

            next.delete('page');

            return next;
        });
    };

    const reset = () => {
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            fields.forEach((field) => next.delete(field.name));
            next.delete('page');
            return next;
        });
    };

    return { values, setFilter, reset }
}
