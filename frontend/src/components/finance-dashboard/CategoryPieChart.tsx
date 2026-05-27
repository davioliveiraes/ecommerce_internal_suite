import type { FinanceFatiaCategoria } from '../../types/finance'
import { formatCurrency } from '../../utils/format'

interface Props {
  despesas: FinanceFatiaCategoria[]
  custos: FinanceFatiaCategoria[]
}

interface Slice {
  label: string
  value: number
  color: string
}

const FALLBACK_COLORS = [
  '#f97316',
  '#1f4f8f',
  '#111827',
  '#737373',
  '#f59e0b',
  '#2563eb',
]

export function CategoryPieChart({ despesas, custos }: Props) {
  const slices = buildSlices(despesas, custos)
  const total = slices.reduce((acc, slice) => acc + slice.value, 0)

  return (
    <section className="border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="kicker mb-1">Categorias</div>
          <h2 className="font-display text-xl font-semibold text-black">
            Saídas por categoria
          </h2>
        </div>
        <div className="font-mono text-xs text-gray-600 tabular-nums">
          {formatCurrency(total)}
        </div>
      </div>

      {slices.length === 0 ? (
        <div className="h-[300px] border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-600">
          Sem categorias no período selecionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-center">
          <svg
            viewBox="0 0 220 220"
            role="img"
            aria-label="Distribuição de custos e despesas por categoria"
            className="w-full max-w-[260px] mx-auto"
          >
            <circle cx="110" cy="110" r="76" fill="#fafafa" />
            {slices.map((slice, index) => {
              const dashArray = `${(slice.value / total) * 100} ${100 - (slice.value / total) * 100}`
              const offset =
                -slices
                  .slice(0, index)
                  .reduce((acc, item) => acc + (item.value / total) * 100, 0) +
                25

              return (
                <circle
                  key={slice.label}
                  cx="110"
                  cy="110"
                  r="76"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="34"
                  strokeDasharray={dashArray}
                  strokeDashoffset={offset}
                  pathLength="100"
                />
              )
            })}
            <circle cx="110" cy="110" r="48" fill="white" />
            <text
              x="110"
              y="105"
              textAnchor="middle"
              className="fill-gray-600"
              fontSize="11"
              fontFamily="monospace"
            >
              saídas
            </text>
            <text
              x="110"
              y="124"
              textAnchor="middle"
              className="fill-black"
              fontSize="14"
              fontFamily="monospace"
            >
              {slices.length}
            </text>
          </svg>

          <div className="space-y-2">
            {slices.map((slice) => (
              <div
                key={slice.label}
                className="grid grid-cols-[1fr_auto] gap-3 items-center border-b border-gray-100 pb-2 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-sm text-black truncate">
                      {slice.label}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-100">
                    <div
                      className="h-full"
                      style={{
                        width: `${(slice.value / total) * 100}%`,
                        backgroundColor: slice.color,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-black tabular-nums">
                    {formatCurrency(slice.value)}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600">
                    {new Intl.NumberFormat('pt-BR', {
                      maximumFractionDigits: 1,
                    }).format((slice.value / total) * 100)}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function buildSlices(
  despesas: FinanceFatiaCategoria[],
  custos: FinanceFatiaCategoria[],
): Slice[] {
  const map = new Map<string, Slice>()

  ;[...despesas, ...custos].forEach((item, index) => {
    const label = item.categoria_nome || 'Sem categoria'
    const previous = map.get(label)
    const value = parseFloat(item.valor)
    if (isNaN(value) || value <= 0) return

    map.set(label, {
      label,
      value: (previous?.value || 0) + value,
      color:
        item.categoria_cor_hex ||
        previous?.color ||
        FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    })
  })

  return Array.from(map.values()).sort((a, b) => b.value - a.value)
}
