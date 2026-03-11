import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { coffeeApi } from '../api/client'
import RadarChart from '../components/RadarChart'
import { QRCodeSVG } from 'qrcode.react'

const STAGE_ICONS: Record<string, string> = { cosecha: '🌿', procesamiento: '⚙️', tostion: '🔥', taza: '☕' }
const STAGE_LABELS: Record<string, string> = { cosecha: 'Cosecha', procesamiento: 'Procesamiento', tostion: 'Tostión', taza: 'En Taza' }

export default function CoffeeDetail() {
  const { id } = useParams()
  const [coffee, setCoffee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'perfil'|'trazabilidad'|'valoraciones'>('perfil')

  useEffect(() => {
    if (id) coffeeApi.get(id).then(r => { setCoffee(r.data); setLoading(false); }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-64 text-coffee-600 text-xl">☕ Cargando...</div>
  if (!coffee) return <div className="text-center py-16 text-coffee-500">Café no encontrado</div>

  const avgRating = coffee.ratings?.length
    ? (coffee.ratings.reduce((s: number, r: any) => s + r.overallScore, 0) / coffee.ratings.length).toFixed(1)
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/catalog" className="text-coffee-600 hover:text-coffee-800 text-sm mb-6 inline-flex items-center gap-1">
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image */}
        <div className="aspect-square bg-coffee-100 rounded-2xl overflow-hidden shadow-lg">
          {coffee.imageUrl
            ? <img src={coffee.imageUrl} alt={coffee.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-8xl">☕</div>
          }
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge bg-coffee-100 text-coffee-700">{coffee.variety}</span>
            <span className="badge bg-coffee-50 text-coffee-600">{coffee.process}</span>
            <span className="badge bg-espresso text-cream">{coffee.roastLevel}</span>
          </div>
          <h1 className="text-3xl font-bold text-espresso font-display mb-2">{coffee.name}</h1>
          <p className="text-coffee-500 mb-4">📍 {coffee.origin}</p>
          {avgRating && <p className="text-coffee-600 mb-2">⭐ {avgRating}/5 ({coffee.ratings.length} valoraciones)</p>}
          <p className="text-coffee-700 mb-6 leading-relaxed">{coffee.description}</p>
          <div className="text-3xl font-bold text-coffee-700 mb-4">${coffee.price?.toLocaleString()} COP</div>
          {coffee.sensoryProfile?.cupperScore && (
            <div className="bg-coffee-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-coffee-700">Puntaje SCA</p>
              <p className="text-3xl font-bold text-coffee-800">{coffee.sensoryProfile.cupperScore} <span className="text-base font-normal text-coffee-500">/ 100</span></p>
            </div>
          )}
          {coffee.qrCode && (
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow">
                <QRCodeSVG value={coffee.qrCode.qrUrl} size={80} />
              </div>
              <div>
                <p className="text-xs text-coffee-500 font-semibold">Escanea para trazabilidad</p>
                <p className="text-xs text-coffee-400">{coffee.qrCode.scanCount} escaneos</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-coffee-200 mb-6 flex gap-6">
        {(['perfil','trazabilidad','valoraciones'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-coffee-600 text-coffee-800' : 'border-transparent text-coffee-400 hover:text-coffee-600'}`}>
            {{ perfil: '🕸️ Perfil Sensorial', trazabilidad: '📍 Trazabilidad', valoraciones: '⭐ Valoraciones' }[tab]}
          </button>
        ))}
      </div>

      {/* Perfil Sensorial */}
      {activeTab === 'perfil' && coffee.sensoryProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="max-w-sm mx-auto w-full">
            <RadarChart profile={coffee.sensoryProfile} label={coffee.name} />
          </div>
          <div>
            <h3 className="font-bold text-espresso mb-4">Notas de sabor</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {JSON.parse(coffee.sensoryProfile.flavorNotes || '[]').map((note: string) => (
                <span key={note} className="badge bg-coffee-100 text-coffee-700 text-sm capitalize">{note}</span>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { k: 'acidez', label: 'Acidez' }, { k: 'cuerpo', label: 'Cuerpo' },
                { k: 'dulzor', label: 'Dulzor' }, { k: 'amargor', label: 'Amargor' },
                { k: 'aroma', label: 'Aroma' }, { k: 'saborResidual', label: 'Sabor Residual' },
                { k: 'balance', label: 'Balance' }, { k: 'uniformidad', label: 'Uniformidad' },
              ].map(({ k, label }) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-coffee-700">{label}</span>
                    <span className="font-semibold text-espresso">{coffee.sensoryProfile[k]}/10</span>
                  </div>
                  <div className="h-2 bg-coffee-100 rounded-full overflow-hidden">
                    <div className="h-full bg-coffee-500 rounded-full transition-all" style={{ width: `${coffee.sensoryProfile[k] * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trazabilidad */}
      {activeTab === 'trazabilidad' && (
        <div className="max-w-2xl">
          {coffee.traceRecords?.length === 0 && <p className="text-coffee-500">Sin registros de trazabilidad aún.</p>}
          <div className="space-y-0">
            {coffee.traceRecords?.map((rec: any, i: number) => (
              <div key={rec.id} className="relative pl-12 pb-8">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-coffee-600 flex items-center justify-center text-white text-sm z-10">
                  {STAGE_ICONS[rec.stage]}
                </div>
                {i < coffee.traceRecords.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-coffee-200" />
                )}
                <div className="card ml-4 !p-4">
                  <h4 className="font-bold text-espresso mb-1">{STAGE_LABELS[rec.stage]}</h4>
                  {rec.notes && <p className="text-sm text-coffee-600 mb-2 italic">{rec.notes}</p>}
                  <div className="text-xs text-coffee-400 space-y-1">
                    {rec.harvestDate && <p>📅 Cosecha: {rec.harvestDate}</p>}
                    {rec.harvestMethod && <p>✂️ Método: {rec.harvestMethod}</p>}
                    {rec.cherryWeightKg && <p>⚖️ Peso: {rec.cherryWeightKg} kg</p>}
                    {rec.humidityPct && <p>💧 Humedad: {rec.humidityPct}%</p>}
                    {rec.roastTempC && <p>🌡️ Temperatura tostión: {rec.roastTempC}°C</p>}
                    {rec.roastDurationMin && <p>⏱️ Duración: {rec.roastDurationMin} min</p>}
                    {rec.brewMethod && <p>☕ Método: {rec.brewMethod}</p>}
                    {rec.waterTempC && <p>🌡️ Agua: {rec.waterTempC}°C</p>}
                    {rec.doseGrams && <p>⚖️ Dosis: {rec.doseGrams}g</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Valoraciones */}
      {activeTab === 'valoraciones' && (
        <div>
          {coffee.ratings?.length === 0 && <p className="text-coffee-500">Sin valoraciones aún. ¡Sé el primero!</p>}
          <div className="space-y-4">
            {coffee.ratings?.map((r: any) => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-espresso">{r.user?.name}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(r.overallScore)}</span>
                </div>
                {r.comment && <p className="text-coffee-700 text-sm italic">"{r.comment}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
