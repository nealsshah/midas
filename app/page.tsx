import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { TransactionTable } from "@/components/vault-table"
import { AIAdvisorCall } from "@/components/ai-advisor-call"
import { BarChart3, ChevronDown, CreditCard, Home, LayoutDashboard, LifeBuoy, PiggyBank, Settings } from "lucide-react"
import { ExpensePieChart } from "@/components/expense-pie-chart"
import financialData from "@/finances.json"

export default function Page() {
  const { totalBalance, monthlySpending, savingsGoal } = financialData.overview

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r bg-background/50 backdrop-blur">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <PiggyBank className="h-6 w-6" />
            <span className="font-bold">Midas</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="Search" className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <BarChart3 className="h-4 w-4" />
              Spending Analysis
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <CreditCard className="h-4 w-4" />
              Accounts
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <Home className="h-4 w-4" />
              Budgets
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <PiggyBank className="h-4 w-4" />
              Savings Goals
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>
        <main className="p-6">
          <div className="mb-6">
            <AIAdvisorCall className="border-primary" />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Financial Overview</h1>
              <div className="text-sm text-muted-foreground">Aug 13, 2023 - Aug 18, 2023</div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Total Balance"
              value={`$${totalBalance.value.toLocaleString()}`}
              change={{ 
                value: `$${totalBalance.change.value.toLocaleString()}`, 
                percentage: `${totalBalance.change.percentage}%`, 
                isPositive: totalBalance.change.isPositive 
              }}
              className="border-primary/20"
            />
            <MetricsCard
              title="Monthly Spending"
              value={`$${monthlySpending.value.toLocaleString()}`}
              change={{ 
                value: `$${monthlySpending.change.value.toLocaleString()}`, 
                percentage: `${monthlySpending.change.percentage}%`, 
                isPositive: monthlySpending.change.isPositive 
              }}
              className="border-primary/20"
            />
            <MetricsCard
              title="Savings Goal Progress"
              value={`$${savingsGoal.value.toLocaleString()}`}
              change={{ 
                value: `$${savingsGoal.change.value.toLocaleString()}`, 
                percentage: `${savingsGoal.change.percentage}%`, 
                isPositive: savingsGoal.change.isPositive 
              }}
              className="border-primary/20"
            />
          </div>
          <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Expense Categories</h2>
            </div>
            <ExpensePieChart />
          </Card>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
            <TransactionTable />
          </div>
        </main>
      </div>
    </div>
  )
}

