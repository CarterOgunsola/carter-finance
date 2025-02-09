"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FinanceData, defaultFinanceData } from "@/types/finance";
import { useFinanceCalculations } from "@/hooks/useFinanceCalculations";
import { DollarSign, PiggyBank, TrendingUp, Percent, Scale } from "lucide-react";

export function WalletCards() {
  const [mounted, setMounted] = useState(false);
  const [financeData] = useLocalStorage<FinanceData>("financeData", defaultFinanceData);
  const calculations = useFinanceCalculations(financeData);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="p-2 sm:p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Net Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">${calculations.monthlyNet.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            After {financeData.income.taxRate}% tax rate
          </p>
        </CardContent>
      </Card>

      <Card className="p-2 sm:p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">${calculations.totalSavings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Savings Rate: {calculations.savingsRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card className="p-2 sm:p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">${calculations.totalExpenses.toFixed(2)}</div>
          <div className="mt-2 grid grid-cols-3 gap-1 sm:gap-2 text-xs text-muted-foreground">
            <div>
              Fixed: ${calculations.monthlyExpenses.fixed.toFixed(0)}
            </div>
            <div>
              Variable: ${calculations.monthlyExpenses.variable.toFixed(0)}
            </div>
            <div>
              Debt: ${calculations.monthlyExpenses.debt.toFixed(0)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-2 sm:p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{calculations.savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Of monthly net income
          </p>
        </CardContent>
      </Card>

      <Card className="p-2 sm:p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Debt-to-Income</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{calculations.debtToIncome.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Monthly debt payments vs income
          </p>
        </CardContent>
      </Card>
    </div>
  );
}