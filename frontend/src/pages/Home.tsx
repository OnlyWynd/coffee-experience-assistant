import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    { icon: '🎯', title: 'Recomendación Inteligente', desc: 'Responde 3 preguntas y descubre el café perfecto para tu paladar y estado de ánimo.', link: '/questionnaire', cta: 'Empezar quiz' },
    { icon: '🌡️', title: 'Temperatura en Tiempo Real', desc: 'Simulamos la temperatura de tu café usando física real. Sabrás exactamente cuándo tomarlo.', link: '/temperature', cta: 'Simular ahora' },
    { icon: '📍', title: 'Trazabilidad Verificable', desc: 'Escanea el QR de tu café y viaja desde la cosecha hasta tu taza.', link: '/catalog', cta: 'Ver catálogo' },
    { icon: '📔', title: 'Pasaporte Cafetero', desc: 'Sella tu pasaporte con cada café que pruebes. Gana insignias y conviértete en catador.', link: '/passport', cta: 'Mi pasaporte' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-espresso text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-coffee-400 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <span className="badge bg-coffee-700 text-coffee-100 mb-4 inline-block">☕ Fusagasugá, Cundinamarca</span>
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6 text-cream">
              Descubre el café<br />
              <span className="text-latte">que te define</span>
            </h1>
            <p className="text-lg md:text-xl text-coffee-200 mb-8 leading-relaxed">
              Tecnología al servicio de la cultura cafetera. Recomendaciones personalizadas,
              trazabilidad del origen y el momento exacto para disfrutar tu taza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/questionnaire" className="btn-primary bg-latte text-espresso hover:bg-coffee-300 text-center text-lg py-3 px-8">
                ¿Qué café soy? →
              </Link>
              <Link to="/catalog" className="btn-secondary border-coffee-400 text-coffee-200 hover:bg-coffee-800 text-center text-lg py-3 px-8">
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative coffee beans */}
        <div className="absolute right-0 top-0 opacity-5 text-[20rem] leading-none select-none">☕</div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-espresso mb-3 font-display">Tres pilares de experiencia</h2>
        <p className="text-center text-coffee-600 mb-12">Todo lo que necesitas para vivir el café de Fusagasugá</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="card group hover:border-coffee-300 border border-transparent">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-espresso mb-2 text-lg">{f.title}</h3>
              <p className="text-coffee-700 text-sm mb-4 leading-relaxed">{f.desc}</p>
              <Link to={f.link} className="text-coffee-600 font-semibold text-sm hover:text-coffee-800 group-hover:underline">
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-coffee-800 text-cream py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '6+', label: 'Cafés de especialidad' },
            { n: '4', label: 'Etapas de trazabilidad' },
            { n: '8', label: 'Dimensiones sensoriales' },
            { n: '100%', label: 'Origen colombiano' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-latte mb-1">{s.n}</div>
              <div className="text-coffee-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
