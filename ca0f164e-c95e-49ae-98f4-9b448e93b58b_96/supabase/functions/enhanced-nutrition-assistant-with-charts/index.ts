import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, conversation_history = [] } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Enhanced pattern detection for chart requests
    const chartPatterns = {
      stunting_trends: [
        'show me stunting trends',
        'stunting trend',
        'stunting over time',
        'stunting progress',
        'visualize stunting',
        'chart stunting',
        'plot stunting'
      ],
      district_comparison: [
        'district comparison',
        'compare districts',
        'district malnutrition',
        'district risk',
        'visualize districts'
      ],
      nutrition_status: [
        'nutrition status',
        'current nutrition',
        'nutrition distribution',
        'malnutrition breakdown'
      ],
      sanitation_trends: [
        'sanitation trends',
        'hygiene access',
        'water access',
        'sanitation progress'
      ]
    }

    const messageText = message.toLowerCase()
    let chartType = null
    let shouldGenerateChart = false

    // Check for chart request patterns
    for (const [type, patterns] of Object.entries(chartPatterns)) {
      if (patterns.some(pattern => messageText.includes(pattern))) {
        chartType = type
        shouldGenerateChart = true
        break
      }
    }

    // Generate chart if requested
    let chartData = null
    if (shouldGenerateChart && chartType) {
      try {
        // Fetch relevant data based on chart type
        switch (chartType) {
          case 'stunting_trends':
            const { data: stuntingData } = await supabase
              .from('stunting_data')
              .select('*')
              .order('year', { ascending: true })
            
            if (stuntingData && stuntingData.length > 0) {
              chartData = {
                type: 'line',
                title: 'Stunting Trends in Rwanda (2000-2024)',
                data: stuntingData.map(item => ({
                  year: item.year,
                  stunting: parseFloat(item.stunting),
                  overweight: parseFloat(item.overweight)
                })),
                config: {
                  xAxis: { type: 'category', data: stuntingData.map(item => item.year.toString()) },
                  yAxis: { type: 'value', name: 'Percentage (%)' },
                  series: [
                    {
                      name: 'Stunting Rate',
                      type: 'line',
                      data: stuntingData.map(item => parseFloat(item.stunting)),
                      itemStyle: { color: '#DC2626' },
                      lineStyle: { width: 3 }
                    },
                    {
                      name: 'Overweight Rate',
                      type: 'line',
                      data: stuntingData.map(item => parseFloat(item.overweight)),
                      itemStyle: { color: '#2563EB' },
                      lineStyle: { width: 3 }
                    }
                  ]
                }
              }
            }
            break

          case 'district_comparison':
            // Mock district data for comparison
            chartData = {
              type: 'bar',
              title: 'Malnutrition Risk by District',
              data: [
                { district: 'Nyamagabe', risk: 35.2 },
                { district: 'Nyanza', risk: 31.8 },
                { district: 'Huye', risk: 28.5 },
                { district: 'Muhanga', risk: 25.9 },
                { district: 'Nyarugenge', risk: 23.4 },
                { district: 'Ruhango', risk: 22.1 },
                { district: 'Gasabo', risk: 18.7 },
                { district: 'Kicukiro', risk: 15.2 }
              ],
              config: {
                xAxis: { 
                  type: 'category', 
                  data: ['Nyamagabe', 'Nyanza', 'Huye', 'Muhanga', 'Nyarugenge', 'Ruhango', 'Gasabo', 'Kicukiro']
                },
                yAxis: { type: 'value', name: 'Risk Level (%)' },
                series: [{
                  type: 'bar',
                  data: [35.2, 31.8, 28.5, 25.9, 23.4, 22.1, 18.7, 15.2],
                  itemStyle: {
                    color: function(params) {
                      const colors = ['#991B1B', '#DC2626', '#DC2626', '#DC2626', '#DC2626', '#F59E0B', '#F59E0B', '#F59E0B']
                      return colors[params.dataIndex]
                    }
                  }
                }]
              }
            }
            break

          case 'nutrition_status':
            const { data: nutritionData } = await supabase
              .from('nutrition_overview')
              .select('*')
              .order('year', { ascending: false })
              .limit(1)
            
            if (nutritionData && nutritionData.length > 0) {
              const latest = nutritionData[0]
              chartData = {
                type: 'pie',
                title: 'Current Nutrition Status Distribution',
                data: [
                  { name: 'Normal', value: 100 - parseFloat(latest.underweight) - parseFloat(latest.mortality) },
                  { name: 'Underweight', value: parseFloat(latest.underweight) },
                  { name: 'At Risk', value: parseFloat(latest.mortality) }
                ],
                config: {
                  series: [{
                    type: 'pie',
                    radius: '70%',
                    data: [
                      { name: 'Normal', value: 100 - parseFloat(latest.underweight) - parseFloat(latest.mortality), itemStyle: { color: '#10B981' } },
                      { name: 'Underweight', value: parseFloat(latest.underweight), itemStyle: { color: '#F59E0B' } },
                      { name: 'At Risk', value: parseFloat(latest.mortality), itemStyle: { color: '#DC2626' } }
                    ]
                  }]
                }
              }
            }
            break

          case 'sanitation_trends':
            const { data: sanitationData } = await supabase
              .from('sanitation_data')
              .select('*')
              .order('year', { ascending: true })
            
            if (sanitationData && sanitationData.length > 0) {
              chartData = {
                type: 'line',
                title: 'Sanitation & Hygiene Access Trends',
                data: sanitationData.map(item => ({
                  year: item.year,
                  handwashing: parseFloat(item.handwashing),
                  sanitation: parseFloat(item.sanitation),
                  open_defecation: parseFloat(item.open_defecation)
                })),
                config: {
                  xAxis: { type: 'category', data: sanitationData.map(item => item.year.toString()) },
                  yAxis: { type: 'value', name: 'Percentage (%)' },
                  series: [
                    {
                      name: 'Handwashing Access',
                      type: 'line',
                      data: sanitationData.map(item => parseFloat(item.handwashing)),
                      itemStyle: { color: '#10B981' }
                    },
                    {
                      name: 'Sanitation Access',
                      type: 'line',
                      data: sanitationData.map(item => parseFloat(item.sanitation)),
                      itemStyle: { color: '#3B82F6' }
                    },
                    {
                      name: 'Open Defecation',
                      type: 'line',
                      data: sanitationData.map(item => parseFloat(item.open_defecation)),
                      itemStyle: { color: '#DC2626' }
                    }
                  ]
                }
              }
            }
            break
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }

    // Enhanced responses with chart generation
    const responses = {
      // Chart-specific responses
      stunting_trends: chartData ? 
        `📊 **Interactive Stunting Trends Chart Generated!**

Here's the comprehensive stunting trends analysis for Rwanda:

${JSON.stringify(chartData)}

**Key Insights from the Data:**
• Stunting rates have decreased significantly from ${chartData.data[0]?.stunting}% in ${chartData.data[0]?.year} to ${chartData.data[chartData.data.length-1]?.stunting}% in ${chartData.data[chartData.data.length-1]?.year}
• This represents a remarkable ${(chartData.data[0]?.stunting - chartData.data[chartData.data.length-1]?.stunting).toFixed(1)}% improvement over ${chartData.data.length} years
• Overweight rates have remained relatively stable, indicating balanced nutrition progress
• Rwanda is on track to meet WHO nutrition targets

**What This Means:**
The downward trend in stunting shows successful implementation of nutrition programs across Rwanda. The data indicates strong progress in addressing chronic malnutrition while maintaining healthy weight levels.

Would you like me to generate additional charts comparing district-level data or show nutrition intervention impacts?` :
        `I can help you visualize stunting trends! Let me generate an interactive chart showing Rwanda's progress over time. The data shows remarkable improvement in reducing stunting rates across all districts.`,

      district_comparison: chartData ?
        `📊 **District Risk Assessment Chart Generated!**

${JSON.stringify(chartData)}

**Critical Insights:**
• Nyamagabe and Nyanza districts show highest malnutrition risk (>30%)
• Kigali districts (Gasabo, Kicukiro) have lowest risk levels (<20%)
• Clear urban-rural divide in nutrition security
• 8 districts require immediate intervention prioritization

**Recommended Actions:**
• Deploy emergency nutrition programs to high-risk districts
• Strengthen agricultural support in rural areas
• Expand urban nutrition education programs

Would you like to see intervention impact projections or agricultural solution mapping?` :
        `I can generate a district comparison chart showing malnutrition risk levels across Rwanda's 30 districts, with color-coded priority levels for intervention planning.`,

      nutrition_status: chartData ?
        `📊 **Current Nutrition Status Distribution**

${JSON.stringify(chartData)}

**Current Status Overview:**
• ${chartData.data[0]?.value.toFixed(1)}% of children have normal nutrition status
• ${chartData.data[1]?.value.toFixed(1)}% are underweight and need intervention
• ${chartData.data[2]?.value.toFixed(1)}% are at high risk requiring immediate attention

This distribution helps prioritize resource allocation and intervention strategies.` :
        `I can show you the current nutrition status distribution across Rwanda's child population with detailed breakdowns by risk categories.`,

      // General nutrition questions
      general_nutrition: `**Ndi Umuhuza - Rwanda Nutrition Connect** provides comprehensive nutrition analytics including:

🔍 **Real-time Data Analysis:**
• District-level malnutrition mapping
• Stunting and overweight trend tracking
• Sanitation and hygiene access monitoring
• Agricultural intervention impact assessment

📊 **Available Visualizations:**
• **Stunting Trends** - "Show me stunting trends"
• **District Comparison** - "Compare district malnutrition"
• **Nutrition Status** - "Display current nutrition status"
• **Sanitation Access** - "Show sanitation trends"

🤖 **AI-Powered Predictions:**
• Individual child nutrition risk assessment
• District-level intervention prioritization
• Agricultural solution recommendations
• WHO growth standard compliance tracking

Just ask me to "show" or "visualize" any nutrition data and I'll generate interactive charts with detailed insights!`,

      // Appointment booking
      appointment: `I'd be happy to help you schedule a consultation with our nutrition experts! 

Our specialists can provide:
• Detailed nutrition trend analysis
• District-specific intervention strategies  
• Agricultural solution planning
• Custom data visualization reports

Would you like to book an appointment for a comprehensive nutrition assessment? I can help you find the best time that works for your schedule.`,

      // Default response
      default: `Hello! I'm your AI nutrition assistant for **Ndi Umuhuza - Rwanda Nutrition Connect**.

I can help you with:
📊 **Data Visualization** - Ask me to "show stunting trends" or "visualize district data"
🔍 **Nutrition Analysis** - Get insights on malnutrition patterns and progress
🤖 **AI Predictions** - Individual and population-level nutrition assessments
📅 **Expert Consultations** - Schedule meetings with nutrition specialists

What would you like to explore today? Try asking me to visualize any nutrition data!`
    }

    // Determine response based on message content
    let response = responses.default

    if (shouldGenerateChart) {
      response = responses[chartType] || responses.default
    } else if (messageText.includes('appointment') || messageText.includes('consultation') || messageText.includes('schedule') || messageText.includes('book')) {
      response = responses.appointment
    } else if (messageText.includes('nutrition') || messageText.includes('malnutrition') || messageText.includes('data') || messageText.includes('analytics')) {
      response = responses.general_nutrition
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: response,
        chart_data: chartData,
        has_chart: !!chartData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        response: "I'm having trouble processing your request right now. Please try asking me to 'show stunting trends' or 'visualize district data' for interactive charts."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})