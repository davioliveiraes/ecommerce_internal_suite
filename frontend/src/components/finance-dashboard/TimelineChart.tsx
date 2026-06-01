import type { FinancePontoMensal, TipoLancamento } from '../../types/finance'
import { formatCurrency } from '../../utils/format'

interface Props {
  data: FinancePontoMensal[]
  visibleTypes?: TipoLancamento[]
}

const WIDTH = 720
const HEIGHT = 300
const PADDING = 36

const SERIES = [
  { key: 'receita', label: 'Receita', color: '#1f4f8f' },
  { key: 'custo', label: 'Custo', color: '#f97316' },
  { key: 'despesa', label: 'Despesa', color: '#0a0a0a' },
] as const

const TYPE_TO_SERIES_KEY: Record<TipoLancamento, (typeof SERIES)[number]['key']> = {
  RECEITA: 'receita',
  CUSTO: 'custo',
  DESPESA: 'despesa',
}

export function TimelineChart({ data, visibleTypes }: Props) {
  const visibleKeys = visibleTypes?.map((tipo) => TYPE_TO_SERIES_KEY[tipo])
  const activeSeries = visibleKeys
    ? SERIES.filter((serie) => visibleKeys.includes(serie.key))
    : SERIES

  const parsed = data.map((point) => ({
    mes: point.mes,
    receita: parseFloat(point.receita),
    custo: parseFloat(point.custo),
    despesa: parseFloat(point.despesa),
  }))

  const maxValue = Math.max(
    1,
    ...parsed.flatMap((point) => activeSeries.map((serie) => point[serie.key])),
  )
  const chartWidth = WIDTH - PADDING * 2
  const chartHeight = HEIGHT - PADDING * 2

  const xFor = (index: number) => {
    if (parsed.length <= 1) return PADDING + chartWidth / 2
    return PADDING + (index / (parsed.length - 1)) * chartWidth
  }
  const yFor = (value: number) => {
    return PADDING + chartHeight - (value / maxValue) * chartHeight
  }

  return (
    <section className="border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="kicker mb-1">Linha temporal</div>
          <h2 className="font-display text-xl font-semibold text-black">
            Evolução mensal
          </h2>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          {activeSeries.map((serie) => (
            <span
              key={serie.key}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600"
            >
              <span
                className="h-2 w-2"
                style={{ backgroundColor: serie.color }}
              />
              {serie.label}
            </span>
          ))}
        </div>
      </div>

      {parsed.length === 0 ? (
        <EmptyChartState message="Sem dados no período selecionado." />
      ) : (
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Evolução mensal financeira"
            className="w-full h-auto"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((step) => {
              const y = PADDING + chartHeight - step * chartHeight
              return (
                <g key={step}>
                  <line
                    x1={PADDING}
                    x2={WIDTH - PADDING}
                    y1={y}
                    y2={y}
                    stroke="#e5e5e5"
                    strokeWidth="1"
                  />
                  <text
                    x={PADDING}
                    y={y - 6}
                    fill="#737373"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {formatCurrency(maxValue * step)}
                  </text>
                </g>
              )
            })}

            {activeSeries.map((serie) => {
              const d = parsed
                .map((point, index) => {
                  const value = point[serie.key]
                  const command = index === 0 ? 'M' : 'L'
                  return `${command} ${xFor(index)} ${yFor(value)}`
                })
                .join(' ')

              return (
                <g key={serie.key}>
                  <path
                    d={d}
                    fill="none"
                    stroke={serie.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {parsed.map((point, index) => (
                    <circle
                      key={`${serie.key}-${point.mes}`}
                      cx={xFor(index)}
                      cy={yFor(point[serie.key])}
                      r="3.5"
                      fill="white"
                      stroke={serie.color}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              )
            })}

            {parsed.map((point, index) => (
              <text
                key={point.mes}
                x={xFor(index)}
                y={HEIGHT - 10}
                fill="#737373"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatMonth(point.mes)}
              </text>
            ))}
          </svg>
        </div>
      )}
    </section>
  )
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="h-[300px] border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-600">
      {message}
    </div>
  )
}

function formatMonth(value: string) {
  const [year, month] = value.split('-')
  if (!year || !month) return value
  return `${month}/${year.slice(2)}`
}
