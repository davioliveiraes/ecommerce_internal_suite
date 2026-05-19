import { ConstructionState } from '../components/ConstructionState'

export function CatalogoPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="kicker mb-4">Módulo 01</div>
      <h1 className="font-display text-5xl font-light text-ink mb-3">
        Catálogo
      </h1>
      <p className="text-ink-2 max-w-2xl mb-16">
        Tabela editável dos produtos da loja, com variações, preços de
        custo, preços de venda, margens e status de integração.
      </p>

      <ConstructionState
        title="Tabela em implementação"
        description="A grade de produtos com AG Grid, edição inline e filtros será entregue na próxima fase."
      />
    </div>
  )
}
