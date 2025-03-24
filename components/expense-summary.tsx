"use client"

import { useMemo } from "react"
import type { Expense } from "@/components/expense-tracker"
import { Card, CardContent } from "@/components/ui/card"
import { isSameDay } from "date-fns"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const today = new Date()

  const stats = useMemo(() => {
    const todayExpenses = expenses.filter((expense) => isSameDay(expense.date, today))

    const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    const categoryCounts = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

    return {
      todayTotal,
      totalExpenses,
      transactionCount: expenses.length,
      topCategory,
    }
  }, [expenses, today])

  return (
    <div>
   
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Today's Spending</div>
            <div className="text-2xl font-bold">${stats.todayTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Spending</div>
            <div className="text-2xl font-bold">${stats.totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Transactions</div>
            <div className="text-2xl font-bold">{stats.transactionCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Top Category</div>
            <div className="text-2xl font-bold">{stats.topCategory}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

