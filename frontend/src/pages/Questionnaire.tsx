import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recommendApi } from '../api/client'

const FLAVORS = [
  { id: 'frutal', label: 'Frutal', emoji: '🍓' },
  { id: 'chocolate', label: 'Chocolate', emoji: '🍫' },
  { id: 'caramelo', label: 'Caramelo', emoji: '🍬' },
  { id: 'floral', label: 'Floral', emoji: '🌸' },
  { id: 'nuez', label: 'Nuez / Avellana', emoji: '🌰' },
  { id: 'especiado', label: 'Especiado', emoji: '🌶️' },
  { id: 'citrico', label: 'Cítrico', emoji: '🍋' },
  { id: 'terroso', label: 'Terroso / Intenso', emoji: '🌍' },
]

const MOODS = [
  { id: 'concentrado', label: 'Concentrado', emoji: '🎯', desc: 'Necesito enfocarme' },
  { id: 'relajado', label: 'Relajado', emoji: '😌', desc: 'Quiero descansar' },
  { id: 'social', label: 'Social', emoji: '🤝', desc: 'Es un momento compartido' },
  { id: 'energetico', label: 'Energético', emoji: '⚡', desc: 'Necesito activarme' },
  { id: 'creativo', label: 'Creativo', emoji: '✨', desc: 'Quiero inspirarme' },
  { id: 'cansado', label: 'Cansado', emoji: '😴', desc: 'Necesito reconfortarme' },
]

export default function Questionnaire() {
  const [step, setStep] = useState(1)
  const [flavors, setFlavors] = useState<string[]>([])
  const [intensity, setIntensity] = useState<number>(3)
  const [mood, setMood] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const toggleFlavor = (id: string) => {
    setFlavors(prev => prev.includes(id) ? prev.filter(f => f !== id) : prev.length < 3 ? [...prev, id] : prev)
  }

  const handleSubmit = async () => {
    if (!mood || flavors.length === 0) return
    setLoading(true)
    try {
      const res = await recommendApi.recommend({ flavorTags: flavors, intensity, mood })
      navigate('/recommendations', { state: { data: res.data } })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-coffee-700 text-white' : 'bg-coffee-100 text-coffee-400'}`}>{s}</div>
            {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-coffee-700' : 'bg-coffee-100'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Flavors */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold text-espresso mb-2">¿Qué sabores te atraen?</h1>
          <p className="text-coffee-600 mb-6">Selecciona hasta 3 perfiles que disfrutes en tu café.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {FLAVORS.map(f => (
              <button key={f.id} onClick={() => toggleFlavor(f.id)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${flavors.includes(f.id) ? 'border-coffee-600 bg-coffee-50 shadow-md' : 'border-coffee-100 bg-white hover:border-coffee-300'}`}>
                <div className="text-2xl mb-1">{f.emoji}</div>
                <div className="text-xs font-semibold text-espresso">{f.label}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={flavors.length === 0}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
            Siguiente →
          </button>
        </div>
      )}

      {/* Step 2: Intensity */}
      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold text-espresso mb-2">¿Qué intensidad prefieres?</h1>
          <p className="text-coffee-600 mb-8">Desde un café suave y delicado hasta uno intenso y poderoso.</p>
          <div className="space-y-3 mb-8">
            {[
              { v: 1, label: 'Muy suave', desc: 'Delicado, fácil de beber', emoji: '🌿' },
              { v: 2, label: 'Suave', desc: 'Ligero, con notas sutiles', emoji: '☁️' },
              { v: 3, label: 'Medio', desc: 'Equilibrado y versátil', emoji: '⚖️' },
              { v: 4, label: 'Intenso', desc: 'Robusto, definido', emoji: '🔥' },
              { v: 5, label: 'Muy intenso', desc: 'Potente, sin concesiones', emoji: '💪' },
            ].map(opt => (
              <button key={opt.v} onClick={() => setIntensity(opt.v)}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${intensity === opt.v ? 'border-coffee-600 bg-coffee-50 shadow-md' : 'border-coffee-100 bg-white hover:border-coffee-300'}`}>
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <div className="font-semibold text-espresso">{opt.label}</div>
                  <div className="text-sm text-coffee-600">{opt.desc}</div>
                </div>
                {intensity === opt.v && <span className="ml-auto text-coffee-600 text-xl">✓</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Anterior</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Siguiente →</button>
          </div>
        </div>
      )}

      {/* Step 3: Mood */}
      {step === 3 && (
        <div>
          <h1 className="text-2xl font-bold text-espresso mb-2">¿Cómo te sientes hoy?</h1>
          <p className="text-coffee-600 mb-6">Tu estado de ánimo afina la recomendación para este momento.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${mood === m.id ? 'border-coffee-600 bg-coffee-50 shadow-md' : 'border-coffee-100 bg-white hover:border-coffee-300'}`}>
                <div className="text-3xl mb-2">{m.emoji}</div>
                <div className="font-semibold text-espresso text-sm">{m.label}</div>
                <div className="text-xs text-coffee-500 mt-1">{m.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Anterior</button>
            <button onClick={handleSubmit} disabled={!mood || loading}
              className="btn-primary flex-1 disabled:opacity-40">
              {loading ? 'Calculando...' : '☕ Ver mis recomendaciones'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
