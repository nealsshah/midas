"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts"
import finances from "@/finances.json"
const data = finances.monthlyExpenses

// Update color scheme to use CSS variables correctly
const COLORS = [
  "hsl(47.9, 95.8%, 53.1%)",  // Brightest gold
  "hsl(47.9, 95.8%, 43.1%)",  // Slightly darker gold
  "hsl(47.9, 95.8%, 33.1%)",  // Medium gold
  "hsl(47.9, 95.8%, 23.1%)",  // Darker gold
  "hsl(47.9, 95.8%, 13.1%)",  // Darkest gold
  "hsl(47.9, 95.8%, 43.1%)",  // Reuse colors for remaining items
  "hsl(47.9, 95.8%, 33.1%)",  // Reuse colors for remaining items
];

export function ExpensePieChart() {
  const totalExpenses = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const centerLabel = React.useMemo(() => {
    if (activeIndex !== null) {
      const item = data[activeIndex];
      return {
        value: `$${item.value.toLocaleString()}`,
        label: item.name
      };
    }
    return {
      value: `$${totalExpenses.toLocaleString()}`,
      label: 'Total'
    };
  }, [activeIndex, totalExpenses]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Monthly Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                labelLine={false} 
                outerRadius={90}
                innerRadius={60}
                fill="#8884d8" 
                dataKey="value"
                strokeWidth={5}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={`hsl(var(--background))`}
                    strokeWidth={2}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-primary text-xl font-bold">
                            {centerLabel.value}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                            {centerLabel.label}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
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
                  <span style={{ color: COLORS[index % COLORS.length], opacity: 0.9 }}>{value}</span>
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
