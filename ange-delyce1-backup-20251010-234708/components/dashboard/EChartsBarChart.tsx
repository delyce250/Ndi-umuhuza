
'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface EChartsBarChartProps {
  data: Array<{
    year: number
    handwashing: number
    sanitation: number
    open_defecation: number
  }>
  title: string
}

export default function EChartsBarChart({ data, title }: EChartsBarChartProps) {
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
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#C7D59F',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: function(params: any) {
          let result = `<strong>Year: ${params[0].axisValue}</strong><br/>`
          params.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: ${param.value}%<br/>`
          })
          return result
        }
      },
      legend: {
        data: ['Handwashing Access', 'Sanitation Access', 'Open Defecation'],
        bottom: 10,
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.year),
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11,
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'Handwashing Access',
          type: 'bar',
          data: data.map(item => item.handwashing),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#10B981' },
                { offset: 1, color: '#059669' }
              ]
            }
          }
        },
        {
          name: 'Sanitation Access',
          type: 'bar',
          data: data.map(item => item.sanitation),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3B82F6' },
                { offset: 1, color: '#1D4ED8' }
              ]
            }
          }
        },
        {
          name: 'Open Defecation',
          type: 'bar',
          data: data.map(item => item.open_defecation),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#EF4444' },
                { offset: 1, color: '#DC2626' }
              ]
            }
          }
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
