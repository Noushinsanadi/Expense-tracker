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

// Add the import for the toast hook and UndoToast component
import { useToast } from "@/hooks/use-toast"
import { UndoToast } from "@/components/ui/toast-undo"

interface TransactionListProps {
  expenses: Expense[]
  onUpdate: (expense: Expense) => void
  onDelete: (id: string) => void
}

// Add the toast hook inside the component
export function TransactionList({ expenses, onUpdate, onDelete }: TransactionListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

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
              <div
                key={expense.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
              >
                <div className="flex-1 min-w-0">
                  {" "}
                  {/* min-w-0 helps with text truncation */}
                  <div className="font-medium break-words">{expense.description}</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                    <span className="inline-block">{expense.category}</span>
                    <span className="inline-block">•</span>
                    <span className="inline-block">{format(expense.date, "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="font-semibold whitespace-nowrap">${expense.amount.toFixed(2)}</div>
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
      onUpdate({ ...editingExpense, ...values }) // ✅ Preserve the original ID
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
                  const expenseToDelete = expenses.find((expense) => expense.id === deleteConfirmId)
                  onDelete(deleteConfirmId)
                  setDeleteConfirmId(null)

                  if (expenseToDelete) {
                  toast({
  title: "Transaction deleted",
  description: `"${expenseToDelete.description}" has been removed`,
  action: (
    <UndoToast
      onUndo={() => {
        onUpdate(expenseToDelete) // 🔥 Ensures the expense is restored properly
      }}
    />
  ),
  duration: 5000,
})

                  }
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

