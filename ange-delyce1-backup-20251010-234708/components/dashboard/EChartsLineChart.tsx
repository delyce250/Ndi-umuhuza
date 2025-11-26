
'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface EChartsLineChartProps {
  data: Array<{
    year: number
    stunting: number
    overweight: number
  }>
  title: string
}

export default function EChartsLineChart({ data, title }: EChartsLineChartProps) {
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
        data: ['Stunting Rate', 'Overweight Rate'],
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
        boundaryGap: false,
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
          name: 'Stunting Rate',
          type: 'line',
          smooth: true,
          data: data.map(item => item.stunting),
          lineStyle: {
            color: '#DC2626',
            width: 3
          },
          itemStyle: {
            color: '#DC2626'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(220, 38, 38, 0.3)' },
                { offset: 1, color: 'rgba(220, 38, 38, 0.05)' }
              ]
            }
          }
        },
        {
          name: 'Overweight Rate',
          type: 'line',
          smooth: true,
          data: data.map(item => item.overweight),
          lineStyle: {
            color: '#2563EB',
            width: 3
          },
          itemStyle: {
            color: '#2563EB'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
                { offset: 1, color: 'rgba(37, 99, 235, 0.05)' }
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
