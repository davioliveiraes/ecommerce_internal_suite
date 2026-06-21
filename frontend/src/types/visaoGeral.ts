export interface VisaoGeralPeriodo {
  id: number
  data_inicio: string
  data_fim: string
  visitas: number
  visualizacoes_categoria: number
  visualizacoes_produto: number
  carrinhos_criados: number
  checkout_iniciado: number
  checkout_entrega: number
  checkout_pagamento: number
  pedidos_criados: number
  pedidos_pagos: number
  receita: string
  observacao: string
  vendas: number
  ticket_medio: string
  conversao_visitas_vendas: string
  conversao_visitas_carrinhos: string
  conversao_checkouts_vendas: string
  label_periodo: string
  criado_em: string
  atualizado_em: string
}

export interface VisaoGeralPeriodoInput {
  data_inicio: string
  data_fim: string
  visitas: number
  visualizacoes_categoria: number
  visualizacoes_produto: number
  carrinhos_criados: number
  checkout_iniciado: number
  checkout_entrega: number
  checkout_pagamento: number
  pedidos_criados: number
  pedidos_pagos: number
  receita: number
  observacao: string
}
