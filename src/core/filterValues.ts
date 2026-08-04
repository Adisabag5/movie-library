import type { FilterField, FilterValue } from '../types/filters'

export const toArray = (value: FilterValue): string[] =>
  Array.isArray(value) ? value : value ? [value] : []

export const toSingle = (value: FilterValue): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '')

export const orNull = (value: string) => (value === '' ? null : value)

export const listOrNull = (values: string[]) => (values.length === 0 ? null : values)

export const toggleValue = (current: string[], value: string) =>
  current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value]

export const emptyLabelFor = (field: FilterField) =>
  field.emptyLabel ??
  `Any ${/^[A-Z][a-z]+$/.test(field.label) ? field.label.toLowerCase() : field.label}`

export const isActive = (value: FilterValue) => toArray(value).length > 0
