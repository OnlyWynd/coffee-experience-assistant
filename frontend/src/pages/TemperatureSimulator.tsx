import { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { tempApi } from '../api/client'
import TemperatureGauge from '../components/TemperatureGauge'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function TemperatureSimulator() {
  const [brewMethod, setBrewMethod] = useState('v60')
  const [container, setContainer] = useState('ceramica')
  const [volume, setVolume] = useState(200)
  const [ambient, setAmbient] = useState(20)
  const [result, setResult] = useState<any>(null)
  const [currentTemp, setCurrentTemp] = useState<number | null>(null)
  const [tracking, setTracking] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<any>(null)
  const startTimeRef = useRef<number>(0)

  const brewLabels: Record<string, string> = {
    espresso: 'Espresso',
    v60: 'V60 Pour Over',
    chemex: 'Chemex',
    french_press: 'French Press',
    cold_brew: 'Cold Brew',
    aeropress: 'AeroPress',
    moka: 'Moka Pot',
    americano: 'Americano',
  }

  const containerLabels: Record<string, string> = {
    ceramica: 'Taza Cerámica',
    vidrio: 'Vaso de Vidrio',
    papel: 'Vaso de Papel',
    termos: 'Termo de Viaje',
    metalico: 'Taza Metálica',
  }

  const simulate = async () => {
    const r = await tempApi.simulate({ brewMethod, containerType: container, volumeMl: volume, ambientTempC: ambient })
    setResult(r.data)
    setCurrentTemp(r.data.currentTemp)
    setElapsed(0)
  }

  const startTracking = () => {
    if (!result) return
    setTracking(true)
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsedMin = (Date.now() - startTimeRef.current) / 60000
      setElapsed(elapsedMin)
      const range = result.optimalRange
      const T0: Record<string, number> = {
        espresso: 88, v60: 93, chemex: 93, french_press: 93,
        cold_brew: 6, aeropress: 88, moka: 85, americano: 90,
      }
      const containerK: Record<string, number> = {
        ceramica: 0.045 / 1.3,
        vidrio: 0.062 / 1.0,
        papel: 0.095 / 0.7,
        termos: 0.012 / 2.5,
        metalico: 0.038 / 1.5,
      }
      const initialTemp = T0[brewMethod] || 90
      const kBase = containerK[container] || 0.035
      const vFactor = Math.pow(200 / Math.max(volume, 50), 0.3)
      const kEff = kBase * vFactor
      const temp = Math.round((ambient + (initialTemp - ambient) * Math.exp(-kEff * elapsedMin)) * 10) / 10
      setCurrentTemp(temp)
      if (temp < range.min - 5 && elapsedMin > 5) {
        clearInterval(intervalRef.current)
        setTracking(false)
      }
    }, 1000)
  }

  const stopTracking = () => {
    clearInterval(intervalRef.current)
    setTracking(false)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const chartData = result ? {
    labels: result.series.map((p: any) => `${p.time}min`),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: result.series.map((p: any) => p.temp),
        borderColor: '#c47020',
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx
          const gradient = canvas.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, '#c4702033')
          gradient.addColorStop(1, '#c4702005')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: `Zona óptima (${result.optimalRange.min}-${result.optimalRange.max}°C)`,
        data: result.series.map(() => result.optimalRange.max),
        borderColor: '#22c55e55',
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      },
    ],
  } : null

  const status = currentTemp != null && result
    ? (currentTemp > result.optimalRange.max ? 'muy_caliente' : currentTemp >= result.optimalRange.min ? 'optimo' : 'frio')
    : 'muy_caliente'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-espresso font-display mb-2">Simulador de Temperatura</h1>
      <p className="text-coffee-600 mb-8">Basado en la Ley de Enfriamiento de Newton — sin sensores físicos</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="card">
          <h2 className="font-bold text-espresso mb-4">Configurar tu café</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-coffee-700 block mb-1">Método de preparación</label>
              <select value={brewMethod} onChange={e => setBrewMethod(e.target.value)}
                className="w-full border-2 border-coffee-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-coffee-500">
                {Object.entries(brewLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-coffee-700 block mb-1">Tipo de contenedor</label>
              <select value={container} onChange={e => setContainer(e.target.value)}
                className="w-full border-2 border-coffee-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-coffee-500">
                {Object.entries(containerLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-coffee-700 block mb-2">Volumen: {volume}ml</label>
              <input type="range" min="50" max="500" step="25" value={volume} onChange={e => setVolume(+e.target.value)}
                className="w-full accent-coffee-600" />
              <div className="flex justify-between text-xs text-coffee-400"><span>50ml</span><span>500ml</span></div>
            </div>
            <div>
              <label className="text-sm font-semibold text-coffee-700 block mb-2">Temperatura ambiente: {ambient}°C</label>
              <input type="range" min="10" max="35" step="1" value={ambient} onChange={e => setAmbient(+e.target.value)}
                className="w-full accent-coffee-600" />
              <div className="flex justify-between text-xs text-coffee-400"><span>10°C</span><span>35°C</span></div>
            </div>
            <button onClick={simulate} className="btn-primary w-full">☕ Simular enfriamiento</button>
          </div>
        </div>

        {/* Gauge */}
        <div className="card flex flex-col items-center justify-center">
          {currentTemp !== null && result ? (
            <>
              <TemperatureGauge
                currentTemp={currentTemp}
                optimalMin={result.optimalRange.min}
                optimalMax={result.optimalRange.max}
                status={status as any}
              />
              {result.windowMinutes && (
                <div className="text-center mt-4 text-sm text-coffee-600">
                  <p>Ventana óptima: <strong>{result.windowMinutes} minutos</strong></p>
                  <p>Inicia en: <strong>{result.optimalStartMin} min</strong></p>
                </div>
              )}
              {!tracking ? (
                <button onClick={startTracking} className="btn-primary mt-4 text-sm">▶ Rastrear en tiempo real</button>
              ) : (
                <div className="mt-4 text-center">
                  <div className="text-sm text-coffee-600 mb-2 animate-pulse">⏱ {elapsed.toFixed(1)} min transcurridos</div>
                  <button onClick={stopTracking} className="btn-secondary text-sm">⏹ Detener</button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-coffee-400">
              <div className="text-6xl mb-4">🌡️</div>
              <p>Configura y simula para ver la temperatura</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData && (
        <div className="card mt-8">
          <h3 className="font-bold text-espresso mb-4">Curva de enfriamiento — 30 minutos</h3>
          <Line data={chartData} options={{
            responsive: true,
            plugins: { legend: { labels: { color: '#3a1d0c' } } },
            scales: {
              x: { ticks: { maxTicksLimit: 10, color: '#6b3a1c' }, grid: { color: '#e0a54c22' } },
              y: {
                min: 0, max: 100,
                ticks: { color: '#6b3a1c', callback: (v: any) => `${v}°C` },
                grid: { color: '#e0a54c22' },
              },
            },
          }} />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-red-600 font-bold">🌡️ Muy caliente</p>
              <p className="text-xs text-red-500">&gt;{result.optimalRange.max}°C</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-green-600 font-bold">✅ Zona óptima</p>
              <p className="text-xs text-green-500">{result.optimalRange.min}–{result.optimalRange.max}°C</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-blue-600 font-bold">❄️ Frío</p>
              <p className="text-xs text-blue-500">&lt;{result.optimalRange.min}°C</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
