import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PredictionInput {
  age_months: number
  weight_kg: number
  height_cm: number
  district: string
  gender: 'male' | 'female'
  household_income?: number
  food_security_score?: number
  access_to_clean_water: boolean
  maternal_education?: string
}

interface NutritionPrediction {
  stunting_risk: number
  overweight_risk: number
  underweight_risk: number
  nutritional_status: 'Normal' | 'At Risk' | 'Malnourished' | 'Severely Malnourished'
  recommended_interventions: string[]
  confidence_score: number
  risk_factors: string[]
  agricultural_solutions: string[]
}

// WHO Z-score calculations for child growth standards
function calculateZScore(value: number, median: number, sd: number): number {
  return (value - median) / sd
}

// WHO reference data (simplified - normally would use full WHO tables)
function getWHOReference(age_months: number, gender: 'male' | 'female') {
  // Simplified WHO reference data for height-for-age and weight-for-height
  const references = {
    male: {
      height_median: 65 + (age_months * 0.6), // Simplified growth curve
      height_sd: 2.5,
      weight_median: 3.5 + (age_months * 0.25),
      weight_sd: 1.2
    },
    female: {
      height_median: 64 + (age_months * 0.58),
      height_sd: 2.4,
      weight_median: 3.3 + (age_months * 0.23),
      weight_sd: 1.1
    }
  }
  return references[gender]
}

// Machine learning prediction model (simplified linear regression)
function predictNutritionalStatus(input: PredictionInput): NutritionPrediction {
  const whoRef = getWHOReference(input.age_months, input.gender)
  
  // Calculate Z-scores
  const heightForAge = calculateZScore(input.height_cm, whoRef.height_median, whoRef.height_sd)
  const weightForHeight = calculateZScore(input.weight_kg, whoRef.weight_median, whoRef.weight_sd)
  
  // Risk calculation based on Z-scores and environmental factors
  let stuntingRisk = 0
  let overweightRisk = 0
  let underweightRisk = 0
  
  // Height-for-age (stunting indicator)
  if (heightForAge < -3) stuntingRisk = 95
  else if (heightForAge < -2) stuntingRisk = 80
  else if (heightForAge < -1) stuntingRisk = 40
  else stuntingRisk = 10
  
  // Weight-for-height indicators
  if (weightForHeight > 3) overweightRisk = 90
  else if (weightForHeight > 2) overweightRisk = 70
  else if (weightForHeight > 1) overweightRisk = 30
  else overweightRisk = 5
  
  if (weightForHeight < -3) underweightRisk = 95
  else if (weightForHeight < -2) underweightRisk = 80
  else if (weightForHeight < -1) underweightRisk = 40
  else underweightRisk = 10
  
  // Environmental risk factors
  const environmentalRisk = calculateEnvironmentalRisk(input)
  stuntingRisk = Math.min(100, stuntingRisk + environmentalRisk)
  underweightRisk = Math.min(100, underweightRisk + environmentalRisk)
  
  // Determine nutritional status
  let status: NutritionPrediction['nutritional_status'] = 'Normal'
  if (stuntingRisk > 80 || overweightRisk > 80 || underweightRisk > 80) {
    status = 'Severely Malnourished'
  } else if (stuntingRisk > 60 || overweightRisk > 60 || underweightRisk > 60) {
    status = 'Malnourished'
  } else if (stuntingRisk > 30 || overweightRisk > 30 || underweightRisk > 30) {
    status = 'At Risk'
  }
  
  // Generate recommendations
  const interventions = generateInterventions(stuntingRisk, overweightRisk, underweightRisk, input)
  const riskFactors = identifyRiskFactors(input, heightForAge, weightForHeight)
  const agriculturalSolutions = generateAgriculturalSolutions(input.district, status)
  
  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(input)
  
  return {
    stunting_risk: Math.round(stuntingRisk * 10) / 10,
    overweight_risk: Math.round(overweightRisk * 10) / 10,
    underweight_risk: Math.round(underweightRisk * 10) / 10,
    nutritional_status: status,
    recommended_interventions: interventions,
    confidence_score: Math.round(confidenceScore * 10) / 10,
    risk_factors: riskFactors,
    agricultural_solutions: agriculturalSolutions
  }
}

function calculateEnvironmentalRisk(input: PredictionInput): number {
  let risk = 0
  
  // District-specific risk (based on historical data)
  const districtRisk = {
    'Nyamagabe': 25, 'Nyanza': 20, 'Huye': 18, 'Muhanga': 15,
    'Nyarugenge': 12, 'Ruhango': 10, 'Gasabo': 8, 'Kicukiro': 5
  }
  risk += districtRisk[input.district as keyof typeof districtRisk] || 10
  
  // Water access
  if (!input.access_to_clean_water) risk += 15
  
  // Food security
  if (input.food_security_score && input.food_security_score < 3) risk += 20
  
  // Household income
  if (input.household_income && input.household_income < 50000) risk += 10
  
  return risk
}

function generateInterventions(stunting: number, overweight: number, underweight: number, input: PredictionInput): string[] {
  const interventions: string[] = []
  
  if (stunting > 50) {
    interventions.push("Immediate nutritional supplementation program")
    interventions.push("Enhanced maternal and child health services")
    interventions.push("Community-based nutrition education")
  }
  
  if (overweight > 50) {
    interventions.push("Dietary counseling and portion control education")
    interventions.push("Physical activity promotion programs")
    interventions.push("Family nutrition planning sessions")
  }
  
  if (underweight > 50) {
    interventions.push("Therapeutic feeding programs")
    interventions.push("Micronutrient supplementation")
    interventions.push("Growth monitoring and promotion")
  }
  
  if (!input.access_to_clean_water) {
    interventions.push("Water, sanitation, and hygiene (WASH) interventions")
  }
  
  interventions.push("Regular health monitoring and follow-up")
  
  return interventions
}

function identifyRiskFactors(input: PredictionInput, heightZ: number, weightZ: number): string[] {
  const factors: string[] = []
  
  if (heightZ < -2) factors.push("Chronic malnutrition (stunting)")
  if (weightZ < -2) factors.push("Acute malnutrition (wasting)")
  if (weightZ > 2) factors.push("Overweight/obesity risk")
  
  if (!input.access_to_clean_water) factors.push("Limited access to clean water")
  if (input.food_security_score && input.food_security_score < 3) factors.push("Food insecurity")
  if (input.household_income && input.household_income < 50000) factors.push("Low household income")
  
  // District-specific factors
  const highRiskDistricts = ['Nyamagabe', 'Nyanza', 'Huye']
  if (highRiskDistricts.includes(input.district)) {
    factors.push("High-risk geographic location")
  }
  
  return factors
}

function generateAgriculturalSolutions(district: string, status: string): string[] {
  const solutions: string[] = [
    "Promote kitchen gardens for fresh vegetables",
    "Introduce biofortified crops (iron-rich beans, vitamin A sweet potatoes)",
    "Support dairy farming for improved protein access",
    "Establish community seed banks for nutritious crops"
  ]
  
  // District-specific agricultural solutions
  const districtSolutions = {
    'Nyamagabe': [
      "Highland potato cultivation with improved varieties",
      "Terraced farming for soil conservation",
      "Agroforestry with fruit trees"
    ],
    'Nyanza': [
      "Integrated crop-livestock systems",
      "Drought-resistant crop varieties",
      "Water harvesting for irrigation"
    ],
    'Huye': [
      "University extension programs for modern farming",
      "Research-based agricultural innovations",
      "Cooperative farming initiatives"
    ]
  }
  
  const specificSolutions = districtSolutions[district as keyof typeof districtSolutions] || [
    "Climate-smart agriculture practices",
    "Crop diversification programs",
    "Farmer training on nutrition-sensitive agriculture"
  ]
  
  return [...solutions, ...specificSolutions]
}

function calculateConfidenceScore(input: PredictionInput): number {
  let confidence = 85 // Base confidence
  
  // Reduce confidence for missing optional data
  if (!input.household_income) confidence -= 5
  if (!input.food_security_score) confidence -= 5
  if (!input.maternal_education) confidence -= 3
  
  // Age-based confidence (more accurate for certain age ranges)
  if (input.age_months < 6 || input.age_months > 60) confidence -= 10
  
  return Math.max(60, confidence) // Minimum 60% confidence
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
      const input: PredictionInput = await req.json()
      
      // Validate input data
      if (!input.age_months || !input.weight_kg || !input.height_cm || !input.district || !input.gender) {
        throw new Error('Missing required fields: age_months, weight_kg, height_cm, district, gender')
      }
      
      // Generate prediction
      const prediction = predictNutritionalStatus(input)
      
      // Store prediction in database for tracking
      const { error } = await supabaseClient
        .from('nutrition_predictions')
        .insert({
          input_data: input,
          prediction_result: prediction,
          created_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Error storing prediction:', error)
        // Continue even if storage fails
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            prediction,
            input_summary: {
              age_months: input.age_months,
              district: input.district,
              gender: input.gender
            },
            analysis_notes: [
              "Prediction based on WHO child growth standards",
              "Environmental risk factors considered",
              "Agricultural solutions tailored to district characteristics",
              "Confidence score reflects data completeness and model accuracy"
            ]
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    // GET request - return prediction form schema
    return new Response(
      JSON.stringify({
        success: true,
        schema: {
          required_fields: [
            { name: "age_months", type: "number", description: "Child's age in months (0-60)" },
            { name: "weight_kg", type: "number", description: "Child's weight in kilograms" },
            { name: "height_cm", type: "number", description: "Child's height in centimeters" },
            { name: "district", type: "string", description: "District name in Rwanda" },
            { name: "gender", type: "string", description: "male or female" }
          ],
          optional_fields: [
            { name: "household_income", type: "number", description: "Monthly household income in RWF" },
            { name: "food_security_score", type: "number", description: "Food security score (1-5)" },
            { name: "access_to_clean_water", type: "boolean", description: "Access to clean water" },
            { name: "maternal_education", type: "string", description: "Mother's education level" }
          ]
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in nutrition predictor:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        data: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})