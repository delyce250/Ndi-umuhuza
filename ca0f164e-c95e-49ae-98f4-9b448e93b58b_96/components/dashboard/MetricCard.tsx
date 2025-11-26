
import { KeyMetric } from '@/lib/supabase'

interface MetricCardProps {
  metric: KeyMetric
}

export default function MetricCard({ metric }: MetricCardProps) {
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'Users': 'ri-group-line',
      'TrendingDown': 'ri-arrow-down-line',
      'Droplets': 'ri-drop-line',
      'TrendingUp': 'ri-arrow-up-line',
      'Heart': 'ri-heart-line',
      'Activity': 'ri-pulse-line'
    }
    return iconMap[iconName] || 'ri-bar-chart-line'
  }

  return (
    <div className="bg-white rounded-full shadow-lg border-4 border-blue-500 p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 aspect-square flex flex-col items-center justify-center text-center relative">
      {/* Top Icon Circle */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
        <i className={`${getIconComponent(metric.icon)} text-blue-600 text-xl leading-none`}></i>
      </div>
      
      {/* Main Content */}
      <div className="mt-4 flex flex-col items-center justify-center h-full">
        <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
        <div className="text-sm font-medium text-gray-800 mb-1 text-center leading-tight">{metric.title}</div>
        <div className="text-xs text-gray-500 text-center leading-tight px-2">{metric.description}</div>
      </div>
    </div>
  )
}
