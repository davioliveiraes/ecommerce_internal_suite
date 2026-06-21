import { apiClient } from './client'
import type {
  VisaoGeralPeriodo,
  VisaoGeralPeriodoInput,
} from '../types/visaoGeral'

const BASE = '/finance/visao-geral'

export async function fetchVisaoGeralPeriodos(): Promise<VisaoGeralPeriodo[]> {
  const response = await apiClient.get<VisaoGeralPeriodo[]>(`${BASE}/`)
  return response.data
}

export async function createVisaoGeralPeriodo(
  payload: VisaoGeralPeriodoInput,
): Promise<VisaoGeralPeriodo> {
  const response = await apiClient.post<VisaoGeralPeriodo>(`${BASE}/`, payload)
  return response.data
}

export async function updateVisaoGeralPeriodo(
  id: number,
  payload: VisaoGeralPeriodoInput,
): Promise<VisaoGeralPeriodo> {
  const response = await apiClient.put<VisaoGeralPeriodo>(`${BASE}/${id}`, payload)
  return response.data
}

export async function deleteVisaoGeralPeriodo(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`)
}
