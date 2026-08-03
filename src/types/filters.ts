export type FilterValue = string | string[] | null

export interface FilterOption {
  value: string
  label: string
}

/**
 * One shape for every filter. Arity is the only thing that varies, so it is a
 * flag rather than a separate kind: `multiple` picks checkboxes and an array,
 * its absence picks radios and a single value. Both render as a dropdown.
 */
export interface FilterField {
  name: string
  label: string
  options: FilterOption[]
  multiple?: boolean
  /** Wording shown while nothing is chosen. Defaults to "Any <label>". */
  emptyLabel?: string
}
