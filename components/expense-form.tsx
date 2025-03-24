"use client"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { Expense } from "@/components/expense-tracker"

const categories = ["Food", "Transportation", "Entertainment", "Utilities", "Shopping", "Health", "Other"]

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
})

type ExpenseFormValues = z.infer<typeof formSchema>

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void
  initialValues?: Omit<Expense, "id">
}

export function ExpenseForm({ onSubmit, initialValues }: ExpenseFormProps) {
  const defaultValues: ExpenseFormValues = initialValues || {
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
  }

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const handleSubmit = (values: ExpenseFormValues) => {
    onSubmit(values)
    if (!initialValues) {
      form.reset(defaultValues)
    }
  }

  return (
    <div>
   
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Lunch, Taxi, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {initialValues ? "Update Expense" : "Add Expense"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

