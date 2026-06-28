import { useEffect, useRef } from 'react'
import { useBlocker } from 'react-router-dom'

import { ConfirmDialog } from '../components/ConfirmDialog'

/**
 * Protege contra perda de alterações não salvas.
 *
 * - `beforeunload`: aviso nativo só ao fechar/recarregar a aba (inevitável e
 *   controlado pelo browser).
 * - Navegação dentro do app (links, voltar): em vez do `window.confirm` nativo,
 *   renderiza um `ConfirmDialog` no estilo da aplicação.
 *
 * Retorna `{ dialog, allowNavigation }`. Renderize `dialog` na página e chame
 * `allowNavigation()` imediatamente antes de uma navegação intencional (ex.:
 * após salvar ou ao descartar via modal próprio) para não disparar o aviso.
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  const bypass = useRef(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !bypass.current &&
      hasUnsavedChanges &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  const allowNavigation = () => {
    bypass.current = true
  }

  const dialog = (
    <ConfirmDialog
      isOpen={blocker.state === 'blocked'}
      title="Sair sem salvar?"
      description="Há alterações não salvas. Se você sair agora, elas serão perdidas."
      confirmLabel="Sair sem salvar"
      cancelLabel="Continuar editando"
      onConfirm={() => blocker.proceed?.()}
      onCancel={() => blocker.reset?.()}
    />
  )

  return { dialog, allowNavigation }
}
