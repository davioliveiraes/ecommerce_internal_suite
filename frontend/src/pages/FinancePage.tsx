import { ConstructionState } from '../components/ConstructionState'

export function FinancePage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="kicker mb-4">Módulo 02</div>
      <h1 className="font-display text-5xl font-light text-ink mb-3">
        Finance
      </h1>
      <p className="text-ink-2 max-w-2xl mb-16">
        Painel de custos, receitas e despesas com séries temporais e
        indicadores de margem operacional.
      </p>

      <ConstructionState
        title="Dashboard em desenho"
        description="Os gráficos de custos, receitas e despesas serão entregues em fase futura, após a modelagem do domínio Finance."
      />
    </div>
  )
}
