import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Topbar } from './components/Topbar'
import { HomePage } from './pages/HomePage'
import { CatalogoPage } from './pages/CatalogoPage'
import { EditarProdutoPage } from './pages/EditarProdutoPage'
import { FinancePage } from './pages/FinancePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-full flex flex-col">
          <Topbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogoPage />} />
              <Route
                path="/catalogo/produtos/:id/editar"
                element={<EditarProdutoPage />}
              />
              <Route path="/finance" element={<FinancePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
