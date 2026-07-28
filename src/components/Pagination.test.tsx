import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination'
import { renderWithProviders } from '../test/utils'

// Queries are scoped to this render's own container: a couple of these tests
// mount two pagers to compare states, and unscoped screen queries would then
// match both.
const setup = (props: Partial<React.ComponentProps<typeof Pagination>> = {}) => {
  const onPageChange = vi.fn()
  const { container } = renderWithProviders(
    <Pagination page={2} totalPages={10} onPageChange={onPageChange} {...props} />
  )
  const scope = within(container)
  return {
    onPageChange,
    scope,
    prev: scope.getByRole('button', { name: /prev/i }),
    next: scope.getByRole('button', { name: /next/i }),
    user: userEvent.setup(),
  }
}

describe('Pagination', () => {
  it('announces the current page', () => {
    const { scope } = setup({ page: 3, totalPages: 12 })

    expect(scope.getByText('Page 3 of 12')).toBeInTheDocument()
  })

  it('asks for the next and previous page relative to the current one', async () => {
    const { onPageChange, prev, next, user } = setup({ page: 5 })

    await user.click(next)
    await user.click(prev)

    expect(onPageChange).toHaveBeenNthCalledWith(1, 6)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4)
  })

  it('disables Prev on the first page only', () => {
    expect(setup({ page: 1 }).prev).toBeDisabled()
    expect(setup({ page: 2 }).prev).toBeEnabled()
  })

  it('disables Next on the last page only', () => {
    expect(setup({ page: 10, totalPages: 10 }).next).toBeDisabled()
    expect(setup({ page: 9, totalPages: 10 }).next).toBeEnabled()
  })

  // Disabling both directions while a fetch is in flight stranded the user
  // whenever that fetch paused (offline) and never resolved. Busy is
  // advertised through aria-busy instead, and the controls stay usable.
  it('stays navigable while busy', () => {
    const { prev, next, scope } = setup({ page: 5, isBusy: true })

    expect(prev).toBeEnabled()
    expect(next).toBeEnabled()
    expect(scope.getByRole('navigation')).toHaveAttribute('aria-busy', 'true')
  })

  it('marks the page label as a live region for screen readers', () => {
    const { scope } = setup({ page: 2 })

    expect(scope.getByText(/page 2 of/i)).toHaveAttribute('aria-live', 'polite')
  })
})
