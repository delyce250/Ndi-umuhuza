
'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface EChartsRadarChartProps {
  data: any[]
  title: string
}

export default function EChartsRadarChart({ data, title }: EChartsRadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const chart = echarts.init(chartRef.current)

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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#C7D59F',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        data: ['Current Status', 'Target Goals'],
        bottom: 10,
        textStyle: {
          color: '#666'
        }
      },
      radar: {
        indicator: [
          { name: 'Nutrition Access', max: 100 },
          { name: 'Healthcare Quality', max: 100 },
          { name: 'Education Level', max: 100 },
          { name: 'Economic Status', max: 100 },
          { name: 'Infrastructure', max: 100 },
          { name: 'Food Security', max: 100 }
        ],
        center: ['50%', '55%'],
        radius: '60%',
        axisName: {
          color: '#666',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(199, 213, 159, 0.1)', 'rgba(199, 213, 159, 0.05)']
          }
        }
      },
      series: [
        {
          name: 'Nutrition Indicators',
          type: 'radar',
          data: [
            {
              value: [78, 65, 82, 71, 69, 74],
              name: 'Current Status',
              itemStyle: {
                color: '#40531A'
              },
              areaStyle: {
                color: 'rgba(64, 83, 26, 0.3)'
              }
            },
            {
              value: [95, 90, 95, 85, 88, 92],
              name: 'Target Goals',
              itemStyle: {
                color: '#C7D59F'
              },
              areaStyle: {
                color: 'rgba(199, 213, 159, 0.3)'
              }
            }
          ]
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
