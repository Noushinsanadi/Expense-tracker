"use client"

import { useState } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { TransactionList } from "@/components/transaction-list"
import { ExpenseSummary } from "@/components/expense-summary"
import { ExpenseChart } from "@/components/expense-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ToastUndo } from "@/components/ui/toast-undo"

export type Expense = {
  id: string
  amount: number
  description: string
  category: string
  date: Date
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [recentlyDeleted, setRecentlyDeleted] = useState<Expense | null>(null)

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    }
    setExpenses([...expenses, newExpense])
  }

 const updateExpense = (updatedExpense: Expense) => {
  setExpenses((prevExpenses) => {
    const exists = prevExpenses.some((expense) => expense.id === updatedExpense.id)
    return exists ? prevExpenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)) 
                  : [...prevExpenses, updatedExpense] // 🔥 Adds back if it's missing
  })
}



  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id)
    if (expenseToDelete) {
      setRecentlyDeleted(expenseToDelete)
      setExpenses(expenses.filter((expense) => expense.id !== id))
    }
  }

 
const undoDelete = () => {
  if (recentlyDeleted) {
    setExpenses((prevExpenses) => [...prevExpenses, recentlyDeleted])
    setRecentlyDeleted(null) // Clear after restoring
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* MAIN TITLE */}

      <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Add a New Expense</h2>
            <ExpenseForm onSubmit={addExpense} />
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
      <ToastUndo onUndo={undoDelete} />
    </div>
  )
}

