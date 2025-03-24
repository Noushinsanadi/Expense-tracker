import { ExpenseTracker } from "@/components/expense-tracker"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">💰 Daily Expense Tracker</h1>
      <ExpenseTracker />
    </main>
  )
}

