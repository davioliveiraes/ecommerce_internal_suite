import { Link, useLocation } from 'react-router-dom'

export function Topbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-brand-600 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-800">
            Ibeize Ecommerce Control
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClass('/')}>
            Início
          </Link>
          <Link to="/catalogo" className={linkClass('/catalogo')}>
            Catálogo
          </Link>
          <Link to="/finance" className={linkClass('/finance')}>
            Finance
          </Link>
        </nav>
      </div>
    </header>
  )
}
