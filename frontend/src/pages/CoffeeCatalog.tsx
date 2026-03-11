import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { coffeeApi } from '../api/client'

export default function CoffeeCatalog() {
  const [coffees, setCoffees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    coffeeApi.list().then(r => { setCoffees(r.data); setLoading(false); }).catch(() => setLoading(false))
  }, [])

  const filtered = coffees.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.origin.toLowerCase().includes(filter.toLowerCase()) ||
    c.process.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) return <div className="flex justify-center items-center h-64 text-coffee-600 text-xl">☕ Cargando catálogo...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-espresso font-display">Catálogo de Cafés</h1>
          <p className="text-coffee-600 mt-1">{coffees.length} cafés de especialidad colombianos</p>
        </div>
        <input
          type="text" placeholder="Buscar por nombre, origen..." value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border-2 border-coffee-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-coffee-500 w-full sm:w-72"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(coffee => (
          <Link to={`/coffee/${coffee.id}`} key={coffee.id}
            className="card hover:shadow-xl border border-coffee-100 group block">
            <div className="aspect-video bg-coffee-100 rounded-xl mb-4 overflow-hidden">
              {coffee.imageUrl
                ? <img src={coffee.imageUrl} alt={coffee.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-full flex items-center justify-center text-5xl">☕</div>
              }
            </div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-espresso text-lg leading-tight group-hover:text-coffee-700 transition-colors">{coffee.name}</h3>
              <span className="text-coffee-700 font-bold text-sm ml-2 whitespace-nowrap">
                ${coffee.price.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-coffee-500 mb-2">{coffee.origin}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-coffee-100 text-coffee-700">{coffee.variety}</span>
              <span className="badge bg-coffee-50 text-coffee-600">{coffee.process}</span>
              <span className="badge bg-espresso text-cream">{coffee.roastLevel}</span>
            </div>
            {coffee.sensoryProfile && (
              <div className="mt-3 pt-3 border-t border-coffee-100">
                <div className="flex gap-2 text-xs text-coffee-600">
                  <span>Acidez {coffee.sensoryProfile.acidez}/10</span>
                  <span>·</span>
                  <span>Cuerpo {coffee.sensoryProfile.cuerpo}/10</span>
                  {coffee.sensoryProfile.cupperScore && (
                    <><span>·</span><span className="font-bold text-coffee-700">SCA {coffee.sensoryProfile.cupperScore}</span></>
                  )}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-coffee-500">
          <div className="text-5xl mb-4">☕</div>
          <p>No encontramos cafés con esa búsqueda</p>
        </div>
      )}
    </div>
  )
}
