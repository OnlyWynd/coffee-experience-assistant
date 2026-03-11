import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { coffeeApi } from '../api/client'

const STAGE_LABELS: Record<string,string> = { cosecha:'Cosecha', procesamiento:'Procesamiento', tostion:'Tostión', taza:'En Taza' }

export default function Traceability() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      coffeeApi.get(id).then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-64 text-coffee-600 text-xl">☕ Cargando trazabilidad...</div>

  if (!data) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">❓</div>
      <h1 className="text-2xl font-bold text-espresso mb-2">QR no encontrado</h1>
      <p className="text-coffee-600">Este código QR no corresponde a ningún café en nuestro sistema.</p>
    </div>
  )

  const stages = data.traceRecords || []
  const ICONS: Record<string,string> = { cosecha:'🌿', procesamiento:'⚙️', tostion:'🔥', taza:'☕' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {data.imageUrl && (
        <div className="aspect-video bg-coffee-100 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-espresso font-display">{data.name}</h1>
        <p className="text-coffee-500 mt-1">📍 {data.origin} · {data.variety} · {data.process}</p>
        <p className="text-coffee-400 text-sm mt-1">{data.description}</p>
      </div>

      <h2 className="text-xl font-bold text-espresso mb-6 flex items-center gap-2">
        <span>📍</span> Del campo a tu taza
      </h2>

      <div className="space-y-0">
        {stages.map((stage: any, i: number) => (
          <div key={stage.id} className="relative pl-12 pb-6">
            <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-coffee-700 flex items-center justify-center text-white z-10 shadow-md">
              {ICONS[stage.stage] || '📌'}
            </div>
            {i < stages.length - 1 && <div className="absolute left-4 top-9 bottom-0 w-0.5 bg-coffee-200" />}
            <div className="bg-white rounded-xl border border-coffee-100 p-4 ml-2 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-espresso">{STAGE_LABELS[stage.stage]}</span>
                <span className="badge bg-coffee-100 text-coffee-600 text-xs">Etapa {stage.stageOrder}/4</span>
              </div>
              {stage.notes && <p className="text-sm text-coffee-600 italic mb-2">{stage.notes}</p>}
              <div className="grid grid-cols-2 gap-1 text-xs text-coffee-500">
                {stage.harvestDate && <span>📅 {stage.harvestDate}</span>}
                {stage.harvestMethod && <span>✂️ {stage.harvestMethod}</span>}
                {stage.cherryWeightKg && <span>⚖️ {stage.cherryWeightKg} kg</span>}
                {stage.humidityPct && <span>💧 Humedad {stage.humidityPct}%</span>}
                {stage.roastTempC && <span>🌡️ {stage.roastTempC}°C</span>}
                {stage.roastDurationMin && <span>⏱️ {stage.roastDurationMin} min</span>}
                {stage.brewMethod && <span>☕ {stage.brewMethod}</span>}
                {stage.waterTempC && <span>💧 Agua {stage.waterTempC}°C</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
