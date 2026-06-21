interface Props {
  dataInicio: string
  dataFim: string
  onDataInicioChange: (value: string) => void
  onDataFimChange: (value: string) => void
  onClear: () => void
}

export function DashboardFilters({
  dataInicio,
  dataFim,
  onDataInicioChange,
  onDataFimChange,
  onClear,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-gray-600 mb-1.5">
          Início
        </label>
        <input
          type="date"
          value={dataInicio}
          onChange={(event) => onDataInicioChange(event.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors font-mono"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-gray-600 mb-1.5">
          Fim
        </label>
        <input
          type="date"
          value={dataFim}
          onChange={(event) => onDataFimChange(event.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors font-mono"
        />
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
