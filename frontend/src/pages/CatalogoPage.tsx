export function CatalogoPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Ibeize Catálogo
      </h1>
      <p className="text-slate-600 mb-8">
        Gerenciamento de produtos
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Em construção
        </h2>
        <p className="text-slate-500">
          A tabela de produtos com AG Grid será implementada na próxima fase.
        </p>
      </div>
    </div>
  )
}
