import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface SensoryProfile {
  acidez: number; cuerpo: number; dulzor: number; amargor: number;
  aroma: number; saborResidual: number; balance: number; uniformidad: number;
}

interface Props {
  profile: SensoryProfile
  label?: string
  color?: string
  compact?: boolean
}

export default function RadarChart({ profile, label = 'Perfil Sensorial', color = '#c47020', compact = false }: Props) {
  const data = {
    labels: ['Acidez', 'Cuerpo', 'Dulzor', 'Amargor', 'Aroma', 'Sabor\nResidual', 'Balance', 'Uniformidad'],
    datasets: [{
      label,
      data: [profile.acidez, profile.cuerpo, profile.dulzor, profile.amargor, profile.aroma, profile.saborResidual, profile.balance, profile.uniformidad],
      backgroundColor: color + '33',
      borderColor: color,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0, max: 10,
        ticks: { stepSize: 2, font: { size: compact ? 9 : 11 }, color: '#6b3a1c' },
        grid: { color: '#e0a54c44' },
        pointLabels: { font: { size: compact ? 9 : 12 }, color: '#3a1d0c' },
        angleLines: { color: '#e0a54c66' },
      },
    },
    plugins: { legend: { display: !compact, labels: { color: '#3a1d0c', font: { size: 13 } } } },
  }

  return <Radar data={data} options={options} />
}
