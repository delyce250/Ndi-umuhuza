
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface TrendChartProps {
  data: Array<{
    year: number
    stunting: number
    overweight: number
  }>
  title: string
}

export default function TrendChart({ data, title }: TrendChartProps) {
  return (
    <div className="bg-white rounded-full shadow-lg p-8 aspect-square flex flex-col">
      <h3 className="text-lg font-semibold text-[#40531A] mb-4 text-center">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              formatter={(value: any, name: string) => [
                `${value}%`,
                name === 'stunting' ? 'Stunting Rate' : 'Overweight Rate'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="stunting" 
              stroke="#DC2626" 
              strokeWidth={3}
              dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#DC2626', strokeWidth: 2 }}
              name="Stunting Rate"
            />
            <Line 
              type="monotone" 
              dataKey="overweight" 
              stroke="#2563EB" 
              strokeWidth={3}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              name="Overweight Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}