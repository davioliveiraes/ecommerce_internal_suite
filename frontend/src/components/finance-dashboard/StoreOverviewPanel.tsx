import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchFinanceDashboard } from '../../api/financeDashboard'
import type { FinanceDashboard, FinancePontoMensal } from '../../types/finance'
import { formatCurrency, formatPercent } from '../../utils/format'

type PeriodKey = 'today' | '7d' | '30d' | 'year'

const PERIODS: Array<{ key: PeriodKey; label: string }> = [
  { key: 'today', label: 'Hoje' },
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: 'year', label: 'Ano atual' },
]

export function StoreOverviewPanel() {
  const [period, setPeriod] = useState<PeriodKey>('year')
  const range = useMemo(() => getPeriodRange(period), [period])

  const overviewQuery = useQuery({
    queryKey: ['finance-store-overview', period, range],
    queryFn: () =>
      fetchFinanceDashboard({
        data_inicio: range.dataInicio,
        data_fim: range.dataFim,
        tipo: 'RECEITA',
        incluir_pendentes: false,
      }),
  })

  return (
    <section className="border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-5">
        <div>
          <div className="kicker mb-1">Visão geral</div>
          <h2 className="font-display text-xl font-semibold text-black">
            Sua loja em números: visão geral
          </h2>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-mono text-[10px] uppercase tracking-wider">
            Período
          </span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as PeriodKey)}
            className="border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:border-orange"
          >
            {PERIODS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {overviewQuery.isLoading && (
        <div className="border border-gray-200 bg-gray-50 px-6 py-16 text-center font-mono text-sm text-gray-600">
          carregando visão geral...
        </div>
      )}

      {overviewQuery.isError && (
        <div className="border border-orange/40 bg-orange-soft px-6 py-5">
          <div className="kicker mb-2">Erro</div>
          <h3 className="font-display text-lg font-semibold text-black mb-1">
            Falha ao carregar visão geral
          </h3>
          <p className="text-sm text-gray-600">
            {(overviewQuery.error as Error)?.message || 'Erro desconhecido'}
          </p>
        </div>
      )}

      {overviewQuery.data && <OverviewContent dashboard={overviewQuery.data} />}
    </section>
  )
}

function OverviewContent({ dashboard }: { dashboard: FinanceDashboard }) {
  const receita = parseFloat(dashboard.kpis.receita_total)
  const vendas = dashboard.receita_vendas_por_forma_pagamento.reduce(
    (acc, item) => acc + item.vendas,
    0,
  )
  const ticketMedio = vendas > 0 ? receita / vendas : 0
  const conversaoCarrinho = 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5">
      <RevenueOverviewChart data={dashboard.serie_mensal} />

      <div className="space-y-3">
        <OverviewMetricCard color="#0ea5b7" title="Vendas" value={String(vendas)} />
        <OverviewMetricCard
          color="#d6008f"
          title="Receita"
          value={formatCurrency(receita)}
        />
        <OverviewMetricCard
          color="#9b35a7"
          title="Ticket médio"
          value={formatCurrency(ticketMedio)}
        />
        <OverviewMetricCard
          color="#1d1ee8"
          title="Conversão do carrinho"
          value={formatPercent(conversaoCarrinho)}
        />
      </div>
    </div>
  )
}

function RevenueOverviewChart({ data }: { data: FinancePontoMensal[] }) {
  const parsed = data.map((point) => ({
    label: formatMonth(point.mes),
    receita: parseFloat(point.receita),
  }))
  const maxReceita = Math.max(1, ...parsed.map((point) => point.receita))

  if (parsed.length === 0) {
    return (
      <div className="h-[320px] border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-600">
        Sem receita no período selecionado.
      </div>
    )
  }

  return (
    <div className="border border-gray-200 px-5 pt-6 pb-4">
      <div className="grid min-h-[300px] items-end gap-4 border-b border-gray-300">
        {parsed.map((point) => (
          <div key={point.label} className="flex h-full min-w-0 flex-col">
            <div className="mb-2 text-center font-mono text-[11px] text-gray-600">
              {formatCurrency(point.receita)}
            </div>
            <div className="flex min-h-0 flex-1 items-end justify-center">
              <div
                className="w-12 bg-[#0ea5b7] transition-[height] duration-300"
                style={{
                  height: `${Math.max(1, (point.receita / maxReceita) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-3 truncate text-center font-mono text-xs text-gray-600">
              {point.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-black">
        <span className="h-3 w-3 bg-[#0ea5b7]" />
        Receita
      </div>
    </div>
  )
}

function OverviewMetricCard({
  color,
  title,
  value,
}: {
  color: string
  title: string
  value: string
}) {
  return (
    <div className="border border-gray-200 px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-3 w-3" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-black">{title}</span>
      </div>
      <div className="font-mono text-lg text-gray-700 tabular-nums">{value}</div>
    </div>
  )
}

function getPeriodRange(period: PeriodKey) {
  const end = new Date()
  end.setMinutes(end.getMinutes() - end.getTimezoneOffset())
  const start = new Date(end)

  if (period === 'today') {
    return {
      dataInicio: toInputDate(start),
      dataFim: toInputDate(end),
    }
  }

  if (period === '7d') {
    start.setDate(start.getDate() - 6)
  } else if (period === '30d') {
    start.setDate(start.getDate() - 29)
  } else {
    start.setMonth(0, 1)
  }

  return {
    dataInicio: toInputDate(start),
    dataFim: toInputDate(end),
  }
}

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatMonth(value: string) {
  const [year, month] = value.split('-')
  if (!year || !month) return value
  return `${month}/${year.slice(2)}`
}
