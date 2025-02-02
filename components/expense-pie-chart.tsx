"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 800 },
  { name: "Transportation", value: 400 },
  { name: "Utilities", value: 300 },
  { name: "Entertainment", value: 200 },
  { name: "Healthcare", value: 150 },
  { name: "Other", value: 542.21 },
]

// Updated color scheme with gradients
const COLORS = [
  ["#ffd700", "#b8860b"],  // Gold gradient
  ["#4682b4", "#1e3a5f"],  // Steel Blue gradient
  ["#20b2aa", "#008b8b"],  // Teal gradient
  ["#3cb371", "#2e8b57"],  // Sea Green gradient
  ["#9370db", "#6a5acd"],  // Lavender gradient
  ["#ffa500", "#ff8c00"],  // Orange gradient
  ["#a9a9a9", "#696969"],  // Gray gradient
]

export function ExpensePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <radialGradient key={`gradient-${index}`} id={`gradient-${index}`}>
                    <stop offset="0%" stopColor={color[0]} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={color[1]} stopOpacity={0.9} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`} 
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background/80 p-2 shadow-sm backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                            <span className="font-bold text-foreground">{payload[0].name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Amount</span>
                            <span className="font-bold text-foreground">${payload[0].value}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry, index) => (
                  <span style={{ color: 'hsl(var(--foreground))', opacity: 0.8 }}>{value}</span>
                )}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
