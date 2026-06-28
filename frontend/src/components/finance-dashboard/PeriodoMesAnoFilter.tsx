import { MESES_PT } from '../../utils/dateRange'

interface Props {
  ano: number
  /** mes = 0-11, ou null para "Ano inteiro". */
  mes: number | null
  anos: number[]
  onAnoChange: (ano: number) => void
  onMesChange: (mes: number | null) => void
  onClear: () => void
}

const selectClass =
  'px-3 py-1.5 text-sm border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors font-mono'

export function PeriodoMesAnoFilter({
  ano,
  mes,
  anos,
  onAnoChange,
  onMesChange,
  onClear,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-gray-600 mb-1.5">
          Mês
        </label>
        <select
          value={mes === null ? 'all' : String(mes)}
          onChange={(event) =>
            onMesChange(
              event.target.value === 'all' ? null : Number(event.target.value),
            )
          }
          className={selectClass}
        >
          <option value="all">Ano inteiro</option>
          {MESES_PT.map((nome, index) => (
            <option key={nome} value={index}>
              {nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-gray-600 mb-1.5">
          Ano
        </label>
        <select
          value={String(ano)}
          onChange={(event) => onAnoChange(Number(event.target.value))}
          className={selectClass}
        >
          {anos.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="h-9 px-3 text-sm border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 transition-colors"
      >
        Limpar filtros
      </button>
    </div>
  )
}
