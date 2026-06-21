// Data de início da operação do ecommerce. Os filtros de período partem daqui.
export const OPERATION_START_DATE = '2026-01-01'

export function getTodayInputValue(): string {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
