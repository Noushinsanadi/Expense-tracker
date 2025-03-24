"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit2, Trash2 } from "lucide-react"
import type { Expense } from "@/components/expense-tracker"
import { ExpenseForm } from "@/components/expense-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TransactionListProps {
  expenses: Expense[]
  onUpdate: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function TransactionList({ expenses, onUpdate, onDelete }: TransactionListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedExpenses = [...filteredExpenses].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <ScrollArea className="h-[300px]">
        {sortedExpenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions found</p>
        ) : (
          <div className="space-y-2">
            {sortedExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-muted-foreground flex gap-2">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{format(expense.date, "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">${expense.amount.toFixed(2)}</div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingExpense(expense)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(expense.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={editingExpense !== null} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialValues={editingExpense}
              onSubmit={(values) => {
                onUpdate({ ...values, id: editingExpense.id })
                setEditingExpense(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDelete(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

