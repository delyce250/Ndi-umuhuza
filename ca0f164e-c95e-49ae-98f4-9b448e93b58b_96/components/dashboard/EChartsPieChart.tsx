
'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface EChartsPieChartProps {
  data: Array<{
    year: number
    underweight: number
    mortality: number
  }>
  title: string
}

export default function EChartsPieChart({ data, title }: EChartsPieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const chart = echarts.init(chartRef.current)

    const latestData = data[data.length - 1]
    
    const pieData = [
      { 
        value: latestData.underweight, 
        name: 'Underweight Children',
        itemStyle: { color: '#F59E0B' }
      },
      { 
        value: latestData.mortality, 
        name: 'Child Mortality Rate',
        itemStyle: { color: '#EF4444' }
      },
      { 
        value: 100 - latestData.underweight - latestData.mortality, 
        name: 'Healthy Population',
        itemStyle: { color: '#10B981' }
      }
    ]

    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: '#40531A',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#C7D59F',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: '{a} <br/>{b}: {c}% ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        textStyle: {
          color: '#666'
        }
      },
      series: [
        {
          name: 'Nutrition Status',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData
        }
      ]
    }

    chart.setOption(option)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [data, title])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div ref={chartRef} className="w-full h-80"></div>
    </div>
  )
}
