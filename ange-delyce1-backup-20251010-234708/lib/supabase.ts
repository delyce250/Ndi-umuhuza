
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  auth: {
    persistSession: false
  }
})

export interface KeyMetric {
  id: string
  metric_type: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  description: string
  color: string
  icon: string
  created_at: string
}

export interface StuntingData {
  id: string
  year: number
  stunting: string
  overweight: string
  created_at: string
}

export interface NutritionOverview {
  id: string
  year: number
  underweight: string
  mortality: string
  created_at: string
}

export interface SanitationData {
  id: number
  year: number
  handwashing: string
  sanitation: string
  open_defecation: string
  created_at: string
}

export interface OverweightUnderFive {
  id: string
  year: number
  male_rate: string
  female_rate: string
  total_rate: string
  created_at: string
}
