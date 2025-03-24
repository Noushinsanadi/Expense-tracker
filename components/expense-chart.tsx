"use client"

import { useMemo, useState, useEffect } from "react"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import type { Expense } from "@/components/expense-tracker"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface ExpenseChartProps {
  expenses: Expense[] // Received props
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [isClient, setIsClient] = useState(false) // Safe client check

  useEffect(() => {
    setIsClient(true)
  }, [])

  const chartData = useMemo(() => {
    const today = new Date()
    const startDay = startOfWeek(today)

    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startDay, index)
      const dayExpenses = expenses.filter((expense) => isSameDay(expense.date, date))

      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        name: format(date, "EEE"),
        date: format(date, "MMM d"),
        amount: total,
      }
    })
  }, [expenses])

  const categoryData = useMemo(() => {
    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>
    )

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      amount,
    }))
  }, [expenses])

  if (!isClient) {
    // During SSR, render placeholder (avoids mismatch)
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="text-muted-foreground">Loading charts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#f9fafb" }}
                itemStyle={{ color: "#f9fafb" }}
                formatter={(value: any) => [`₹${value}`, "Spent"]}
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 80, bottom: 0 }}
            >
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#f9fafb" }}
                itemStyle={{ color: "#f9fafb" }}
                formatter={(value: any) => [`₹${value}`, "Spent"]}
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
