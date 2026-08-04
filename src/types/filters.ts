export type FilterValue = string | string[] | null

export interface FilterOption {
  value: string
  label: string
}

/**
 * One shape for every filter. Arity is the only thing that varies, so it is a
 * flag rather than a separate kind: `multiple` picks checkboxes and an array,
 * its absence picks radios and a single value. Both render as a dropdown.
 *
 * Generic over the field name so a consumer can narrow it to its own union —
 * `values.gnere` should not compile. It defaults to `string`, which keeps the
 * filter components reusable by anything that has not defined a union.
 */
export interface FilterField<Name extends string = string> {
  name: Name
  label: string
  options: FilterOption[]
  multiple?: boolean
  /** Wording shown while nothing is chosen. Defaults to "Any <label>". */
  emptyLabel?: string
}

/** Partial because a filter that is not set is absent from the URL entirely. */
export type FilterValues<Name extends string = string> = Partial<Record<Name, FilterValue>>
