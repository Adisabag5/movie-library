import { describe, it } from 'vitest'

/**
 * usePageParam.test.tsx is the closest model for these — it pairs the hook
 * with useLocation so a test can assert on the URL the hook actually produced,
 * not just on its return value. Copy that probe pattern.
 */
describe('useFilterParams', () => {
    it.todo('reads the keys it owns out of the query string')

    it.todo('ignores query parameters it does not own')

    it.todo('reports activeCount as the number of filters actually set')

    it.todo('writes a filter change back to the URL')

    // The one that matters most: setSearchParams with an object literal
    // replaces the whole query string. `?page=` must survive.
    it.todo('preserves unrelated query parameters when a filter changes')

    it.todo('resets to page 1 whenever a filter changes')

    it.todo('deletes the key when a filter is cleared instead of leaving it empty')

    it.todo('round-trips a multi-value filter through the URL')

    it.todo('reset clears only the owned keys')
})
