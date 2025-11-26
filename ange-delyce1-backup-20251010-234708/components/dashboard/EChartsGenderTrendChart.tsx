'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface GenderTrendData {
  year: number
  male: number
  female: number
  total: number
}

interface EChartsGenderTrendChartProps {
  data: GenderTrendData[]
  title?: string
}

export default function EChartsGenderTrendChart({
  data,
  title = 'Overweight Under-Five Trends'
}: EChartsGenderTrendChartProps) {
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
        data: ['Male', 'Female', 'Total'],
        top: 40,
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '10%',
        top: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.year),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          color: '#666',
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
          name: 'Male',
          type: 'line',
          smooth: true,
          data: data.map(item => item.male),
          lineStyle: {
            color: '#2563EB',
            width: 3
          },
          itemStyle: {
            color: '#2563EB'
          }
        },
        {
          name: 'Female',
          type: 'line',
          smooth: true,
          data: data.map(item => item.female),
          lineStyle: {
            color: '#D946EF',
            width: 3
          },
          itemStyle: {
            color: '#D946EF'
          }
        },
        {
          name: 'Total',
          type: 'line',
          smooth: true,
          data: data.map(item => item.total),
          lineStyle: {
            color: '#16A34A',
            width: 3
          },
          itemStyle: {
            color: '#16A34A'
          },
          areaStyle: {
            color: 'rgba(22, 163, 74, 0.15)'
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


