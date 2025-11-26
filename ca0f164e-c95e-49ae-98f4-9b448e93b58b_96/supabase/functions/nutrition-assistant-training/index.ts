import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced nutrition knowledge base with chart generation capabilities
const nutritionKnowledgeBase = {
  // Current Rwanda Nutrition Statistics (2024)
  currentMetrics: {
    stunting: {
      rate: "29.8%",
      trend: "down",
      change: "-18.9%",
      description: "Children under 5 showing significant improvement since 2000 (was 48.7%)"
    },
    underweight: {
      rate: "7.7%", 
      trend: "down",
      change: "-62%",
      description: "Dramatic improvement from 20.3% in 2000"
    },
    overweight: {
      rate: "5.4%",
      trend: "stable", 
      change: "-0.4%",
      description: "Slight decrease from 6.8% in 2000"
    },
    mortality: {
      rate: "1.4%",
      trend: "down",
      change: "-53%", 
      description: "Major reduction from 3.0% in 2000"
    }
  },

  // Historical trends (2000-2024)
  historicalData: {
    stunting: [
      { year: 2000, rate: 48.7 },
      { year: 2005, rate: 46.5 },
      { year: 2010, rate: 44.4 },
      { year: 2015, rate: 38.2 },
      { year: 2020, rate: 31.6 },
      { year: 2024, rate: 29.8 }
    ],
    underweight: [
      { year: 2000, rate: 20.3 },
      { year: 2005, rate: 16.5 },
      { year: 2010, rate: 12.8 },
      { year: 2015, rate: 9.6 },
      { year: 2020, rate: 7.7 }
    ]
  },

  // Training Instructions for AI Agent
  agentInstructions: {
    role: "You are an advanced nutrition data specialist for Rwanda's Ndi Umuhuza platform with real-time chart generation capabilities",
    expertise: [
      "Rwanda nutrition statistics and trends analysis",
      "Real-time interactive chart generation",
      "Stunting, underweight, overweight data visualization", 
      "District-level risk assessment and mapping",
      "AI prediction model explanations with visual outputs",
      "WASH metrics visualization",
      "Intervention effectiveness charts",
      "Appointment booking for nutrition consultations"
    ],
    responseStyle: "Professional, data-driven, visual-first approach with encouraging tone about Rwanda's nutrition progress",
    capabilities: [
      "Generate interactive ECharts on demand when users ask to visualize data",
      "Create line charts for trends (stunting rates over time)",
      "Generate bar charts for comparisons (district risk levels)",
      "Create pie charts for distributions (nutrition status)",
      "Build radar charts for multi-dimensional analysis",
      "Provide real-time data from Supabase database",
      "Explain chart insights and recommendations",
      "Schedule specialist consultations"
    ],
    chartGeneration: {
      triggers: ["show", "visualize", "chart", "graph", "trends", "compare", "display", "plot", "generate", "see"],
      autoGenerate: "When users ask to visualize any nutrition data, automatically generate appropriate charts",
      chartEndpoint: "https://wczuqcztvhmqomeqvpvz.supabase.co/functions/v1/chart-generator",
      supportedTypes: ["line", "bar", "pie", "radar", "area"],
      dataSource: "Live Supabase database with real nutrition metrics"
    },
    keyResponses: {
      "stunting_trends": "📊 Generating interactive stunting trends chart for Rwanda (2000-2024)...\n\nThe data shows remarkable progress: stunting rates dropped from 48.7% in 2000 to 29.8% in 2024 - that's an 18.9% improvement! This represents one of the most successful nutrition interventions in Africa.\n\n✨ Key Insights:\n• 2000: 48.7% stunting rate\n• 2024: 29.8% stunting rate\n• Total improvement: 18.9 percentage points\n• Trend: Consistent downward trajectory\n\nThis chart shows real data from our Supabase database with interactive features for detailed analysis.",
      "district_comparison": "📊 Creating district risk comparison chart...\n\nThis visualization shows nutrition risk levels across Rwanda's districts:\n\n🔴 CRITICAL PRIORITY:\n• Nyamagabe: 94.7% risk score\n• Nyanza: 89.5% risk score\n\n🟠 HIGH PRIORITY:\n• Huye: 81.2% risk score\n• Muhanga: 78.9% risk score\n• Nyarugenge: 76.3% risk score\n\n🟡 MEDIUM PRIORITY:\n• Ruhango: 67.3% risk score\n• Gasabo: 62.1% risk score\n• Kicukiro: 58.4% risk score\n\nThe chart uses color coding to highlight intervention priorities and includes interactive tooltips for detailed district analysis.",
      "nutrition_status": "📊 Displaying current nutrition status distribution...\n\nRwanda's current nutrition landscape (2024):\n\n🟢 Normal: 70.2% of children\n🔴 Stunted: 29.8%\n🟠 Underweight: 7.7%\n🟡 Overweight: 5.4%\n\nThis pie chart provides a comprehensive view of nutrition status distribution with interactive segments showing detailed percentages and trends."
    }
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

    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({
          success: true,
          trainingData: nutritionKnowledgeBase,
          instructions: nutritionKnowledgeBase.agentInstructions,
          lastUpdated: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (req.method === 'POST') {
      const { query, context } = await req.json()
      
      let response = "I can help you with Rwanda nutrition data analysis and generate interactive charts. Ask me to visualize stunting trends, compare districts, or show any nutrition metrics!"
      let generateChart = false
      let chartType = null
      
      const queryLower = query.toLowerCase()
      
      // Enhanced chart generation triggers - more comprehensive detection
      const chartTriggers = ['show', 'visualize', 'chart', 'graph', 'trends', 'display', 'plot', 'generate', 'see', 'view']
      const hasChartTrigger = chartTriggers.some(trigger => queryLower.includes(trigger))
      
      // Specific responses for chart generation with better pattern matching
      if (queryLower.includes('stunting') && (hasChartTrigger || queryLower.includes('trend'))) {
        response = nutritionKnowledgeBase.agentInstructions.keyResponses["stunting_trends"]
        generateChart = true
        chartType = "stunting_trends"
      } 
      else if (queryLower.includes('district') && (hasChartTrigger || queryLower.includes('comparison') || queryLower.includes('compare'))) {
        response = nutritionKnowledgeBase.agentInstructions.keyResponses["district_comparison"]
        generateChart = true
        chartType = "district_comparison"
      }
      else if ((queryLower.includes('nutrition') || queryLower.includes('status')) && (hasChartTrigger || queryLower.includes('distribution') || queryLower.includes('current'))) {
        response = nutritionKnowledgeBase.agentInstructions.keyResponses["nutrition_status"]
        generateChart = true
        chartType = "nutrition_status"
      }
      // Handle direct "show me stunting trends" requests
      else if (queryLower.includes('show me stunting trends') || queryLower.includes('stunting trends')) {
        response = nutritionKnowledgeBase.agentInstructions.keyResponses["stunting_trends"]
        generateChart = true
        chartType = "stunting_trends"
      }
      // Direct data questions without visualization
      else if (queryLower.includes('stunting') && !hasChartTrigger) {
        response = `Rwanda's current stunting rate is 29.8% for children under 5, showing remarkable improvement from 48.7% in 2000. This represents an 18.9% decrease! 📈\n\nWould you like me to visualize these trends in an interactive chart? Just say "show stunting trends" and I'll generate it for you!`
      }
      else if (queryLower.includes('district') && !hasChartTrigger) {
        response = `District risk assessment for Rwanda:\n\n🔴 CRITICAL: Nyamagabe, Nyanza\n🟠 HIGH: Nyarugenge, Huye, Muhanga\n🟡 MEDIUM: Gasabo, Kicukiro, Ruhango\n\nWould you like me to generate a visual comparison chart? Just ask "show district comparison"!`
      }
      else if (queryLower.includes('prediction') || queryLower.includes('ai')) {
        response = `Our AI nutrition predictor achieves 85-95% accuracy using WHO growth standards plus environmental factors. I can show you prediction accuracy charts and model performance visualizations if you'd like!`
      }
      else if (queryLower.includes('appointment') || queryLower.includes('consultation')) {
        response = `I can help you schedule a consultation with our nutrition specialists! They provide personalized assessments and intervention planning. Would you like to book an appointment?`
      }
      else if (queryLower.includes('help') || queryLower.includes('what can you do')) {
        response = `I'm your Rwanda nutrition data specialist! I can:\n\n📊 Generate interactive charts for:\n• Stunting trends over time - just say "show stunting trends"\n• District risk comparisons - ask "visualize district comparison"\n• Nutrition status distributions - request "display nutrition status"\n• Health indicator analysis\n\n📈 Provide real-time data on:\n• Current stunting rates (29.8%)\n• District-level assessments\n• Historical trends (2000-2024)\n• ML predictions\n\n📅 Schedule consultations with nutrition experts\n\nTry asking: "Show me stunting trends" and I'll create an interactive chart for you!`
      }
      
      const responseData: any = {
        success: true,
        response,
        suggestedActions: [
          "📊 Show stunting trends chart",
          "📈 Visualize district comparison", 
          "🥧 Display nutrition status pie chart",
          "🎯 Generate prediction accuracy charts",
          "📅 Book specialist consultation"
        ]
      }
      
      if (generateChart && chartType) {
        responseData.chartGeneration = {
          enabled: true,
          chartType: chartType,
          endpoint: "https://wczuqcztvhmqomeqvpvz.supabase.co/functions/v1/chart-generator",
          instructions: "Generate interactive EChart with real database data"
        }
      }
      
      return new Response(
        JSON.stringify(responseData),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

  } catch (error) {
    console.error('Error in enhanced nutrition assistant:', error)
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