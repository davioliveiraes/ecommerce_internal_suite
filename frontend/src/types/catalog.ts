export type Status = 'ATIVO' | 'INATIVO'

export interface Variacao {
  id: number
  produto_id: number
  produto_nome_site: string
  produto_nome_gestaoclick: string
  produto_descricao_site: string
  produto_descricao_gestaoclick: string
  sku_nuvemshop: string
  id_gestaoclick: string
  codigo_barras: string
  descricao: string
  custo: string
  preco_loja: string
  preco_site: string | null
  margem_percentual: string | null
  status_nuvemshop: Status
  status_integracao: Status
  ativo: boolean
  criado_em: string
  atualizado_em: string
}
