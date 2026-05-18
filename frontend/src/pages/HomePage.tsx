import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/health'

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Bem-vindo
        </h1>
        <p className="text-lg text-slate-600">
          Selecione o módulo que deseja acessar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/catalogo"
          className="group bg-white rounded-xl border border-slate-200 p-8 hover:border-brand-500 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Ibeize Catálogo
          </h2>
          <p className="text-slate-600">
            Gerenciamento da base de produtos: cadastro, edição e
            visualização em tabela estilo Excel.
          </p>
        </Link>

        <Link
          to="/finance"
          className="group bg-white rounded-xl border border-slate-200 p-8 hover:border-brand-500 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Ibeize Finance
          </h2>
          <p className="text-slate-600">
            Dashboard de Custos, Receitas e Despesas com visualizações
            e indicadores.
          </p>
        </Link>
      </div>

      <div className="text-center">
        <ApiStatus isLoading={isLoading} isError={isError} data={data} />
      </div>
    </div>
  )
}

function ApiStatus({
  isLoading,
  isError,
  data,
}: {
  isLoading: boolean
  isError: boolean
  data?: { status: string }
}) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-slate-500">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        Verificando API...
      </span>
    )
  }
  if (isError) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-rose-600">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        API offline — verifique se o backend está rodando
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs text-emerald-600">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      API conectada ({data?.status})
    </span>
  )
}
