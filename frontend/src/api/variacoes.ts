import { apiClient } from './client'
import type { Variacao } from '../types/catalog'

export async function fetchVariacoes(params?: {
  q?: string
  inativos?: boolean
  produto_id?: number
}): Promise<Variacao[]> {
  const response = await apiClient.get<Variacao[]>('/catalog/variacoes/', {
    params,
  })
  return response.data
}

export async function fetchVariacao(id: number): Promise<Variacao> {
  const response = await apiClient.get<Variacao>(`/catalog/variacoes/${id}`)
  return response.data
}

export async function fetchVariacoesPorProduto(
  produtoId: number,
): Promise<Variacao[]> {
  const response = await apiClient.get<Variacao[]>('/catalog/variacoes/', {
    params: { produto_id: produtoId, inativos: true },
  })
  return response.data
}

export interface VariacaoPrecosPatch {
  custo?: number
  preco_loja?: number | null
  preco_site?: number | null
  preco_promocional?: number | null
}

export async function patchVariacao(
  id: number,
  payload: VariacaoPrecosPatch,
): Promise<Variacao> {
  const response = await apiClient.patch<Variacao>(
    `/catalog/variacoes/${id}`,
    payload,
  )
  return response.data
}

export async function archiveVariacao(id: number): Promise<Variacao> {
  const response = await apiClient.post<Variacao>(
    `/catalog/variacoes/${id}/archive`,
  )
  return response.data
}

export async function restoreVariacao(id: number): Promise<Variacao> {
  const response = await apiClient.post<Variacao>(
    `/catalog/variacoes/${id}/restore`,
  )
  return response.data
}
