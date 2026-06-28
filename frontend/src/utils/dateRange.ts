// Data de início da operação do ecommerce. Os filtros de período partem daqui.
export const OPERATION_START_DATE = '2026-01-01'

export function getTodayInputValue(): string {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

export const MESES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

/** Lista de anos disponíveis, do início da operação até o ano atual. */
export function getAnosDisponiveis(): number[] {
  const inicio = Number(OPERATION_START_DATE.slice(0, 4))
  const atual = new Date().getFullYear()
  const anos: number[] = []
  for (let ano = atual; ano >= inicio; ano -= 1) anos.push(ano)
  return anos
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** Intervalo [data_inicio, data_fim] de um mês específico (mes = 0-11). */
export function intervaloDoMes(ano: number, mes: number): {
  dataInicio: string
  dataFim: string
} {
  const ultimoDia = new Date(ano, mes + 1, 0).getDate()
  return {
    dataInicio: `${ano}-${pad2(mes + 1)}-01`,
    dataFim: `${ano}-${pad2(mes + 1)}-${pad2(ultimoDia)}`,
  }
}

/** Intervalo [data_inicio, data_fim] de um ano inteiro. */
export function intervaloDoAno(ano: number): {
  dataInicio: string
  dataFim: string
} {
  return { dataInicio: `${ano}-01-01`, dataFim: `${ano}-12-31` }
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR')

/** Formata um datetime ISO (ex.: "2026-06-25T13:40:00Z") em "25/06/2026 13:40". */
export function formatDateTimeBR(
  value: string | number | Date | null | undefined,
): string | null {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return DATE_TIME_FORMATTER.format(date)
}

/** Formata uma data "yyyy-mm-dd" em "dd/mm/yyyy" (sem fuso). */
export function formatDateBR(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return DATE_FORMATTER.format(date)
}
