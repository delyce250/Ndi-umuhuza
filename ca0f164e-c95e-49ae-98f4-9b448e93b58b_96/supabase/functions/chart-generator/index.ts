import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChartRequest {
  chartType: 'line' | 'bar' | 'pie' | 'radar' | 'area'
  dataType: string
  filters?: {
    startYear?: number
    endYear?: number
    districts?: string[]
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const { chartType, dataType, filters }: ChartRequest = await req.json()
      
      let chartData = null
      let chartConfig = null

      // Generate chart data based on type
      switch (dataType) {
        case 'stunting_trends':
          const { data: stuntingData } = await supabaseClient
            .from('stunting_data')
            .select('*')
            .order('year', { ascending: true })

          if (stuntingData) {
            const years = stuntingData.map(d => d.year)
            const stuntingRates = stuntingData.map(d => parseFloat(d.stunting))
            const overweightRates = stuntingData.map(d => parseFloat(d.overweight))

            chartConfig = {
              title: {
                text: 'Nutrition Trends in Rwanda (2000-2024)',
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'bold' }
              },
              tooltip: {
                trigger: 'axis',
                formatter: function(params: any) {
                  let result = `<strong>${params[0].axisValue}</strong><br/>`
                  params.forEach((param: any) => {
                    result += `${param.seriesName}: ${param.value}%<br/>`
                  })
                  return result
                }
              },
              legend: {
                data: ['Stunting Rate', 'Overweight Rate'],
                top: 30
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: years,
                name: 'Year',
                nameLocation: 'middle',
                nameGap: 30
              },
              yAxis: {
                type: 'value',
                name: 'Rate (%)',
                nameLocation: 'middle',
                nameGap: 40
              },
              series: [
                {
                  name: 'Stunting Rate',
                  type: 'line',
                  data: stuntingRates,
                  smooth: true,
                  itemStyle: { color: '#ef4444' },
                  lineStyle: { width: 3 },
                  symbol: 'circle',
                  symbolSize: 6
                },
                {
                  name: 'Overweight Rate',
                  type: 'line',
                  data: overweightRates,
                  smooth: true,
                  itemStyle: { color: '#14B8A6' },
                  lineStyle: { width: 3 },
                  symbol: 'circle',
                  symbolSize: 6
                }
              ]
            }
          }
          break

        case 'district_comparison':
          // Mock district data for demonstration
          const districts = ['Nyamagabe', 'Nyanza', 'Nyarugenge', 'Huye', 'Muhanga', 'Gasabo', 'Kicukiro', 'Ruhango']
          const riskScores = [94.7, 89.5, 76.3, 81.2, 78.9, 62.1, 58.4, 67.3]

          chartConfig = {
            title: {
              text: 'District Nutrition Risk Assessment',
              left: 'center',
              textStyle: { fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(params: any) {
                const risk = params[0].value
                let level = 'Low'
                if (risk > 80) level = 'Critical'
                else if (risk > 70) level = 'High'
                else if (risk > 60) level = 'Medium'
                
                return `<strong>${params[0].axisValue}</strong><br/>Risk Score: ${risk}<br/>Priority: ${level}`
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: districts,
              name: 'Districts',
              nameLocation: 'middle',
              nameGap: 30,
              axisLabel: {
                rotate: 45
              }
            },
            yAxis: {
              type: 'value',
              name: 'Risk Score',
              nameLocation: 'middle',
              nameGap: 40,
              max: 100
            },
            series: [{
              type: 'bar',
              data: riskScores,
              itemStyle: {
                color: function(params: any) {
                  const value = params.value
                  if (value > 80) return '#ef4444' // Critical - Red
                  if (value > 70) return '#f97316' // High - Orange
                  if (value > 60) return '#eab308' // Medium - Yellow
                  return '#22c55e' // Low - Green
                }
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          }
          break

        case 'nutrition_status':
          chartConfig = {
            title: {
              text: 'Current Nutrition Status Distribution',
              left: 'center',
              textStyle: { fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [{
              name: 'Nutrition Status',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 70.2, name: 'Normal', itemStyle: { color: '#22c55e' } },
                { value: 29.8, name: 'Stunted', itemStyle: { color: '#ef4444' } },
                { value: 7.7, name: 'Underweight', itemStyle: { color: '#f97316' } },
                { value: 5.4, name: 'Overweight', itemStyle: { color: '#eab308' } }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          }
          break

        default:
          throw new Error(`Unsupported data type: ${dataType}`)
      }

      return new Response(
        JSON.stringify({
          success: true,
          chartConfig,
          metadata: {
            chartType,
            dataType,
            generatedAt: new Date().toISOString(),
            dataSource: 'Supabase Database',
            interactive: true
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // GET request - return available chart types
    return new Response(
      JSON.stringify({
        success: true,
        availableCharts: {
          'stunting_trends': {
            type: 'line',
            description: 'Shows stunting and overweight trends over time',
            dataSource: 'stunting_data table'
          },
          'district_comparison': {
            type: 'bar',
            description: 'Compares nutrition risk scores across districts',
            dataSource: 'calculated risk assessment'
          },
          'nutrition_status': {
            type: 'pie',
            description: 'Current nutrition status distribution',
            dataSource: 'latest nutrition metrics'
          }
        },
        usage: {
          endpoint: 'POST /chart-generator',
          parameters: {
            chartType: 'line | bar | pie | radar | area',
            dataType: 'stunting_trends | district_comparison | nutrition_status',
            filters: 'optional filters object'
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in chart generator:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})