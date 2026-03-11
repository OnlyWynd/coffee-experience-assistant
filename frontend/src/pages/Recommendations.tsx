import { useLocation, useNavigate, Link } from 'react-router-dom'
import RadarChart from '../components/RadarChart'

export default function Recommendations() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const data = state?.data

  if (!data) {
    navigate('/questionnaire')
    return null
  }

  const { recommendations } = data

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-espresso font-display mb-2">Tus 3 cafés perfectos</h1>
        <p className="text-coffee-600">Basados en tus preferencias sensoriales y estado de ánimo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec: any, i: number) => (
          <div key={rec.coffee.id} className={`card border-2 ${i === 0 ? 'border-coffee-400 shadow-xl' : 'border-coffee-100'} relative`}>
            {i === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coffee-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                ⭐ Mejor match
              </div>
            )}

            <div className="aspect-square bg-coffee-100 rounded-xl mb-4 overflow-hidden">
              {rec.coffee.imageUrl ? (
                <img src={rec.coffee.imageUrl} alt={rec.coffee.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">☕</div>
              )}
            </div>

            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-espresso text-lg leading-tight">{rec.coffee.name}</h3>
              <span className={`badge font-bold text-sm ${i === 0 ? 'bg-coffee-100 text-coffee-700' : 'bg-gray-100 text-gray-600'}`}>
                {rec.score}%
              </span>
            </div>

            <p className="text-xs text-coffee-500 mb-3">{rec.coffee.origin} · {rec.coffee.process}</p>

            <p className="text-sm text-coffee-700 mb-4 italic leading-relaxed">"{rec.reason}"</p>

            {rec.coffee.sensoryProfile && (
              <div className="mb-4">
                <RadarChart profile={rec.coffee.sensoryProfile} label={rec.coffee.name} compact />
              </div>
            )}

            <div className="flex gap-2">
              <Link to={`/coffee/${rec.coffee.id}`}
                className="flex-1 text-center btn-primary !py-2 text-sm">
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button onClick={() => navigate('/questionnaire')} className="btn-secondary">
          ← Hacer otro quiz
        </button>
      </div>
    </div>
  )
}
