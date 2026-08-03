import { describe, it } from 'vitest'

/**
 * A spec to build against rather than a suite to maintain. Turn each todo
 * into a real test as you implement that behaviour — `npm test` reports todos
 * separately from passes, so this list doubles as a progress bar.
 */
describe('FilterBar', () => {
    it.todo('renders a labelled control for every field it is given')

    it.todo('shows the current value from `values`, not internal state')

    it.todo('reports a search change as onChange(name, text)')

    it.todo('reports a select change as onChange(name, optionValue)')

    it.todo('adds to the array when a multi option is picked')

    it.todo('removes from the array when a picked multi option is unpicked')

    it.todo('clears a filter by reporting null rather than an empty string')

    it.todo('renders no reset control when onReset is omitted')

    it.todo('calls onReset when the reset control is used')

    it.todo('marks itself busy so a screen reader knows results are updating')

    // The component owns no state — same contract as Pagination. If a test
    // has to click twice to see the right value, state has leaked inside.
    it.todo('does not change what it shows until new values are passed in')
})
