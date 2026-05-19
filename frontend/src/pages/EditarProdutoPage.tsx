import { useParams } from 'react-router-dom'
import { ConstructionState } from '../components/ConstructionState'

export function EditarProdutoPage() {
  const { id } = useParams()

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <div className="kicker mb-3">Módulo 01 · Edição</div>
      <h1 className="font-display text-3xl font-semibold text-black mb-1 tracking-tight">
        Editar produto
      </h1>
      <p className="text-sm text-gray-600 mb-12 font-mono">
        produto · #{id}
      </p>

      <ConstructionState
        title="Formulário em construção"
        description="A tela de edição do produto será implementada na próxima fase."
      />
    </div>
  )
}
