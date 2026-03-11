import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { authApi } from '../api/client'

export default function Passport() {
  const { user, token } = useStore()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (token) authApi.me().then(r => setProfile(r.data)).catch(() => {})
  }, [token])

  if (!token || !user) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">📔</div>
      <h1 className="text-2xl font-bold text-espresso mb-3">Tu Pasaporte Cafetero</h1>
      <p className="text-coffee-600 mb-6">Inicia sesión para ver tus sellos, insignias y progreso.</p>
      <Link to="/login" className="btn-primary">Iniciar sesión</Link>
    </div>
  )

  const stamps = profile?.passportStamps || []
  const badges = profile?.userBadges || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Passport cover */}
      <div className="bg-espresso text-cream rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-[15rem] leading-none select-none flex items-center justify-center">☕</div>
        <div className="relative z-10">
          <div className="text-coffee-400 text-sm font-semibold mb-1 uppercase tracking-widest">Pasaporte Cafetero</div>
          <div className="text-cream text-sm mb-1">República del Café · Colombia</div>
          <h1 className="text-3xl font-bold font-display text-latte mb-4">{user.name}</h1>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-3xl font-bold text-latte">{stamps.length}</div>
              <div className="text-coffee-300 text-xs">Cafés sellados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-latte">{badges.length}</div>
              <div className="text-coffee-300 text-xs">Insignias</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-latte">{profile?.clientProfile?.passportLevel || 1}</div>
              <div className="text-coffee-300 text-xs">Nivel catador</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold text-espresso mb-4">🏅 Insignias obtenidas</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((ub: any) => (
              <div key={ub.badgeId} className="flex items-center gap-2 bg-coffee-50 rounded-xl px-4 py-2">
                <span className="text-2xl">{ub.badge.iconUrl}</span>
                <div>
                  <p className="font-semibold text-espresso text-sm">{ub.badge.name}</p>
                  <p className="text-xs text-coffee-500">{ub.badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stamps grid */}
      <div className="card">
        <h2 className="font-bold text-espresso mb-4">☕ Sellos en tu pasaporte</h2>
        {stamps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-coffee-500 mb-4">Aún no tienes sellos. ¡Prueba tu primer café!</p>
            <Link to="/questionnaire" className="btn-primary">Descubrir mi café</Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {stamps.map((s: any) => (
              <Link to={`/coffee/${s.coffeeId}`} key={s.id}
                className="aspect-square bg-coffee-50 rounded-xl flex flex-col items-center justify-center border-2 border-coffee-200 hover:border-coffee-500 transition-colors group">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {s.stampIcon === 'estrella' ? '⭐' : '✓'}
                </span>
              </Link>
            ))}
            {[...Array(Math.max(0, 12 - stamps.length))].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-coffee-50/50 rounded-xl border-2 border-dashed border-coffee-100" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
