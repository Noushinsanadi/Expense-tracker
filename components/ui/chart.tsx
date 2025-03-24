"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: any[]
  }
>(({ className, data, ...props }, ref) => {
  return (
    <div className={cn("relative w-full h-[300px]", className)} {...props} ref={ref}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

export { ChartContainer }
