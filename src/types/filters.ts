export type FilterValue = string | string[] | null

export interface FilterOption {
  value: string
  label: string
}

export interface FilterField<Name extends string = string> {
  name: Name
  label: string
  options: FilterOption[]
  multiple?: boolean
  emptyLabel?: string
}

export type FilterValues<Name extends string = string> = Partial<Record<Name, FilterValue>>
