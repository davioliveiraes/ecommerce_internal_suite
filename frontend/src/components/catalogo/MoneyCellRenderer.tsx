import type { ICellRendererParams } from 'ag-grid-community'
import { formatCurrency } from '../../utils/format'

export function MoneyCellRenderer(params: ICellRendererParams) {
  if (params.value === null || params.value === undefined) {
    return <span className="text-gray-400">—</span>
  }
  return <span className="font-mono tabular-nums">{formatCurrency(params.value)}</span>
}
