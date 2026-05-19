import { CatalogoGrid } from '../components/catalogo/CatalogoGrid'

export function CatalogoPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-8 py-6">
      <div className="mb-5">
        <div className="kicker mb-1.5">Módulo 01</div>
        <h1 className="font-display text-3xl font-semibold text-black tracking-tight">
          Catálogo
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Variações agrupadas por produto. Use a busca, os filtros nas
          colunas ou expanda os grupos.
        </p>
      </div>

      <CatalogoGrid />
    </div>
  )
}
