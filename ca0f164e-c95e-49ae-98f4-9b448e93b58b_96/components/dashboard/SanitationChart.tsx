
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface SanitationChartProps {
  data: Array<{
    year: number
    handwashing: number
    sanitation: number
    open_defecation: number
  }>
  title: string
}

export default function SanitationChart({ data, title }: SanitationChartProps) {
  return (
    <div className="bg-white rounded-full shadow-lg p-8 aspect-square flex flex-col">
      <h3 className="text-lg font-semibold text-[#40531A] mb-4 text-center">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={10}
            />
            <YAxis 
              stroke="#666"
              fontSize={10}
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #C7D59F',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: string) => {
                const labels: { [key: string]: string } = {
                  'handwashing': 'Handwashing Access',
                  'sanitation': 'Sanitation Access',
                  'open_defecation': 'Open Defecation'
                }
                return [`${value}%`, labels[name]]
              }}
            />
            <Legend />
            <Bar 
              dataKey="handwashing" 
              fill="#06B6D4" 
              name="Handwashing Access"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="sanitation" 
              fill="#10B981" 
              name="Sanitation Access"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="open_defecation" 
              fill="#F59E0B" 
              name="Open Defecation"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}