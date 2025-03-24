"use client"

import { useState } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { TransactionList } from "@/components/transaction-list"
import { ExpenseSummary } from "@/components/expense-summary"
import { ExpenseChart } from "@/components/expense-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react" // For a nice icon (optional)

export type Expense = {
  id: string
  amount: number
  description: string
  category: string
  date: Date
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [message, setMessage] = useState<string | null>(null) // Message state

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    }
    setExpenses([...expenses, newExpense])

    // Show message
    setMessage("Expense added successfully!")

    // Hide message after 2.5 seconds
    setTimeout(() => {
      setMessage(null)
    }, 2500)
  }

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg rounded-2xl relative">
            <h2 className="text-xl font-semibold mb-4">Add a New Expense</h2>
            <ExpenseForm onSubmit={addExpense} />

            {/* Success Message */}
            {message && (
              <div className="absolute top-4 right-4 flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{message}</span>
              </div>
            )}
          </Card>

          <Card className="p-6 shadow-lg rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <ExpenseSummary expenses={expenses} />
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-100 p-1 mb-4">
              <TabsTrigger
                value="list"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="chart"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition"
              >
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <Card className="p-6 shadow-lg rounded-2xl">
                <TransactionList expenses={expenses} onUpdate={updateExpense} onDelete={deleteExpense} />
              </Card>
            </TabsContent>

            <TabsContent value="chart">
              <Card className="p-6 shadow-lg rounded-2xl">
                <ExpenseChart expenses={expenses} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
