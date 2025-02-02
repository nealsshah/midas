"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { TransactionTable } from "@/components/vault-table"
import { AIAdvisorCall } from "@/components/ai-advisor-call"
import { BarChart3, ChevronDown, CreditCard, Home, LayoutDashboard, LifeBuoy, PiggyBank, Settings } from "lucide-react"
import { ExpensePieChart } from "@/components/expense-pie-chart"
import { SavingsGraph } from "@/components/savings-graph"
import financialData from "@/finances.json"
import { FinancialDataUploader } from "@/components/FinancialDataUploader";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if financial data exists and has content
    setHasData(financialData && financialData.overview !== undefined);
  }, []);

  const handleProcessingStart = () => {
    setIsLoading(true);
  };

  const handleProcessingComplete = () => {
    setIsLoading(false);
    setHasData(true);
    window.location.reload(); // Reload to get new financial data
  };

  const handleReset = async () => {
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
      });
      if (res.ok) {
        setHasData(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  };

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
            <FinancialDataUploader 
                  onProcessingStart={handleProcessingStart}
                  onProcessingComplete={handleProcessingComplete}
                />
          </nav>
        </aside>
        <main className="p-6">
          {!hasData ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <FinancialDataUploader 
                  onProcessingStart={handleProcessingStart}
                  onProcessingComplete={handleProcessingComplete}
                />
              </div>
            </div>
          ) : isLoading ? (
            <>
              <div className="mb-6">
                <Skeleton className="h-[200px] w-full" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
              </div>
              <div className="flex w-full gap-4 mt-6">
                <Skeleton className="h-[300px] flex-1" />
                <Skeleton className="h-[300px] flex-1" />
              </div>
              <div className="mt-6">
                <Skeleton className="h-[400px] w-full" />
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
  <div className="space-y-1">
    <h1 className="text-2xl font-bold">Financial Overview</h1>
    <div className="text-sm text-muted-foreground">Aug 13, 2023 - Aug 18, 2023</div>
  </div>
  <div className="w-[700px]">
    <AIAdvisorCall className="border-primary" />
  </div>
</div>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricsCard
                  title="Total Balance"
                  value={`$${financialData.overview.totalBalance.value.toLocaleString()}`}
                  change={{ 
                    value: `$${financialData.overview.totalBalance.change.value.toLocaleString()}`, 
                    percentage: `${financialData.overview.totalBalance.change.percentage}%`, 
                    isPositive: financialData.overview.totalBalance.change.isPositive 
                  }}
                  className="border-primary/20"
                />
                <MetricsCard
                  title="Monthly Spending"
                  value={`$${financialData.overview.monthlySpending.value.toLocaleString()}`}
                  change={{ 
                    value: `$${financialData.overview.monthlySpending.change.value.toLocaleString()}`, 
                    percentage: `${financialData.overview.monthlySpending.change.percentage}%`, 
                    isPositive: financialData.overview.monthlySpending.change.isPositive 
                  }}
                  className="border-primary/20"
                />
                <MetricsCard
                  title="Savings Goal Progress"
                  value={`$${financialData.overview.savingsGoal.value.toLocaleString()}`}
                  change={{ 
                    value: `$${financialData.overview.savingsGoal.change.value.toLocaleString()}`, 
                    percentage: `${financialData.overview.savingsGoal.change.percentage}%`, 
                    isPositive: financialData.overview.savingsGoal.change.isPositive 
                  }}
                  className="border-primary/20"
                />
              </div>
              <div className="flex w-full gap-4 mt-6">
                <div className="flex-1">
                  <SavingsGraph className="w-full" />
                </div>
                <div className="flex-1">
                  <ExpensePieChart className="w-full" />
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                <TransactionTable />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

