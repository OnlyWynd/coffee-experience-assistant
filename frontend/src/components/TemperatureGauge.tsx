interface Props {
  currentTemp: number
  optimalMin: number
  optimalMax: number
  status: 'muy_caliente' | 'optimo' | 'frio'
}

export default function TemperatureGauge({ currentTemp, optimalMin, optimalMax, status }: Props) {
  const maxTemp = 95
  const minTemp = 15
  const pct = Math.max(0, Math.min(100, ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100))
  const r = 70
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - pct / 100)

  const statusColors = { muy_caliente: '#ef4444', optimo: '#22c55e', frio: '#3b82f6' }
  const color = statusColors[status] || '#6b7280'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Background arc */}
        <circle cx="90" cy="90" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset="0" transform="rotate(-90 90 90)" />
        {/* Optimal zone arc */}
        {(() => {
          const optStartPct = ((optimalMin - minTemp) / (maxTemp - minTemp))
          const optEndPct   = ((optimalMax - minTemp) / (maxTemp - minTemp))
          const optLen = (optEndPct - optStartPct) * circumference
          const optOffset = circumference * (1 - optStartPct) - optLen
          return <circle cx="90" cy="90" r={r} fill="none" stroke="#22c55e44" strokeWidth="14"
            strokeDasharray={`${optLen} ${circumference - optLen}`}
            strokeDashoffset={optOffset}
            transform="rotate(-90 90 90)" />
        })()}
        {/* Temperature arc */}
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          transform="rotate(-90 90 90)" className="temperature-gauge" />
        {/* Center text */}
        <text x="90" y="84" textAnchor="middle" className="font-bold" fill={color} fontSize="28" fontWeight="bold">
          {currentTemp.toFixed(1)}°
        </text>
        <text x="90" y="105" textAnchor="middle" fill="#6b3a1c" fontSize="12">Celsius</text>
      </svg>
      <div className={`badge text-sm px-4 py-1.5 font-semibold ${status === 'optimo' ? 'bg-green-100 text-green-800' : status === 'muy_caliente' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
        {{ muy_caliente: '🌡️ Muy caliente', optimo: '✅ Momento perfecto', frio: '❄️ Se ha enfriado' }[status]}
      </div>
      <p className="text-xs text-coffee-600 text-center">Zona óptima: {optimalMin}°C — {optimalMax}°C</p>
    </div>
  )
}
