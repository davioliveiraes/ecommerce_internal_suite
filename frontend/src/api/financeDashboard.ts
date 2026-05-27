import { apiClient } from './client'
import type {
  FinanceDashboard,
  FinanceDashboardFilters,
} from '../types/finance'

function cleanFilters(params?: FinanceDashboardFilters) {
  if (!params) return undefined

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined
    }),
  )
}

export async function fetchFinanceDashboard(
  params?: FinanceDashboardFilters,
): Promise<FinanceDashboard> {
  const response = await apiClient.get<FinanceDashboard>('/finance/dashboard/', {
    params: cleanFilters(params),
  })
  return response.data
}
