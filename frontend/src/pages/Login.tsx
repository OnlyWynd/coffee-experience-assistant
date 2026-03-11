import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/client'
import { useStore } from '../store/useStore'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = mode === 'login'
        ? await authApi.login(email, password)
        : await authApi.register(name, email, password)
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">☕</div>
          <h1 className="text-3xl font-bold text-espresso font-display">
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h1>
          <p className="text-coffee-600 mt-2">
            {mode === 'login' ? 'Accede a tu pasaporte cafetero' : 'Empieza tu aventura cafetera'}
          </p>
        </div>

        <div className="card">
          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="bg-coffee-50 rounded-xl p-3 mb-4 text-xs text-coffee-700">
              <p className="font-semibold mb-1">Credenciales demo:</p>
              <p>👤 demo@coffee.com / cliente123</p>
              <p>🔑 admin@coffee.com / admin123</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-sm font-semibold text-coffee-700 block mb-1">Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full border-2 border-coffee-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-coffee-500"
                  placeholder="Tu nombre" />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-coffee-700 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border-2 border-coffee-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-coffee-500"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-coffee-700 block mb-1">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border-2 border-coffee-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-coffee-500"
                placeholder="••••••••" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
              {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-coffee-600">
            {mode === 'login' ? (
              <>¿No tienes cuenta? <button onClick={() => setMode('register')} className="text-coffee-700 font-semibold hover:underline">Regístrate</button></>
            ) : (
              <>¿Ya tienes cuenta? <button onClick={() => setMode('login')} className="text-coffee-700 font-semibold hover:underline">Inicia sesión</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
