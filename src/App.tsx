import { useState } from 'react'
import './App.css'
import { ExpenseDialog } from './components/expense/expense-dialog'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
          <ExpenseDialog />
        </div>
        
        {/* Dashboard content will go here in next phase */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Placeholder for Summary */}
          <div className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
          
          {/* Placeholder for Recent List */}
          <div className="p-4 border rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Recent Expenses</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
