import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useStore()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/catalog', label: 'Catálogo' },
    { to: '/questionnaire', label: '¿Qué café soy?' },
    { to: '/temperature', label: 'Temperatura' },
    { to: '/passport', label: 'Mi Pasaporte' },
  ]

  return (
    <nav className="bg-espresso text-cream shadow-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-latte hover:text-coffee-200 transition-colors">
          <span className="text-2xl">☕</span>
          <span className="hidden sm:inline">Coffee Experience</span>
          <span className="sm:hidden">CEA</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors hover:text-latte ${location.pathname === l.to ? 'text-latte border-b-2 border-latte pb-1' : 'text-coffee-100'}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-coffee-300">Hola, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="text-sm btn-secondary !py-1 !px-4 border-coffee-400 text-coffee-200 hover:bg-coffee-700">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !py-1 !px-4 bg-coffee-600 hover:bg-coffee-500">Ingresar</Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-cream text-xl p-1">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-coffee-950 px-4 pb-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-cream py-2 border-b border-coffee-800 text-sm">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { logout(); setOpen(false); }} className="text-left text-coffee-300 text-sm py-2">
              Cerrar sesión ({user.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-latte py-2 font-semibold text-sm">
              Ingresar
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
