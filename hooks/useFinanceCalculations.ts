"use client";

import { useMemo } from "react";
import { FinanceData, ASSET_ALLOCATIONS, PROJECTION_PERIODS, MILESTONES } from "@/types/finance";

export interface FinanceCalculations {
  monthlyNet: number;
  totalSavings: number;
  totalExpenses: number;
  monthlyExpenses: {
    fixed: number;
    variable: number;
    debt: number;
  };
  savingsRate: number;
  debtToIncome: number;
  netWorth: number;
  assetAllocation: {
    stocks: number;
    bonds: number;
    other: number;
    total: number;
  };
  projections: {
    netWorth: Array<{
      date: string;
      conservative: number;
      moderate: number;
      aggressive: number;
    }>;
    milestones: Array<{
      amount: number;
      label: string;
      projectedDate: string;
    }>;
  };
  monthlyInvestmentProjections: {
    contribution: number;
    taxAdvantaged: number;
    taxable: number;
  };
}

export function useFinanceCalculations(financeData: FinanceData): FinanceCalculations {
  return useMemo(() => {
    // Basic calculations from before
    const monthlyNet = financeData.income.monthlyGross * (1 - financeData.income.taxRate / 100);
    const totalSavings = Object.values(financeData.savings).reduce((a, b) => a + b, 0);
    const monthlyExpenses = {
      fixed: Object.values(financeData.expenses.fixed).reduce((a, b) => a + b, 0),
      variable: Object.values(financeData.expenses.variable).reduce((a, b) => a + b, 0),
      debt: Object.values(financeData.expenses.debt).reduce((a, b) => a + b, 0),
    };
    const totalExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
    const savingsRate = monthlyNet > 0 ? ((monthlyNet - totalExpenses) / monthlyNet) * 100 : 0;
    const debtToIncome = monthlyNet > 0 ? (monthlyExpenses.debt / monthlyNet) * 100 : 0;

    // Calculate total assets
    const totalProperties = Object.values(financeData.assets?.properties || {}).reduce((a, b) => a + b, 0);
    const totalInvestments = Object.values(financeData.assets?.investments || {
      stocks: 0,
      bonds: 0,
      other: 0,
    }).reduce((a, b) => a + b, 0);
    const totalAssets = (financeData.assets?.cash || 0) + totalProperties + totalInvestments;

    // Calculate total liabilities
    const totalMortgages = Object.values(financeData.liabilities?.mortgages || {}).reduce((a, b) => a + b, 0);
    const totalLoans = Object.values(financeData.liabilities?.loans || {}).reduce((a, b) => a + b, 0);
    const totalCreditCards = Object.values(financeData.liabilities?.creditCards || {}).reduce((a, b) => a + b, 0);
    const totalLiabilities = totalMortgages + totalLoans + totalCreditCards;

    // Calculate net worth
    const netWorth = totalAssets - totalLiabilities;

    // Calculate current asset allocation
    const { stocks = 0, bonds = 0, other = 0 } = financeData.assets?.investments || {};
    const totalInvestmentAssets = stocks + bonds + other;
    const assetAllocation = {
      stocks,
      bonds,
      other,
      total: totalInvestmentAssets,
    };

    // Calculate investment projections
    const calculateGrowth = (
      principal: number,
      monthlyContribution: number,
      years: number,
      returnRate: number,
      inflationRate: number
    ) => {
      const monthlyRate = returnRate / 12 / 100;
      const inflationAdjustment = 1 - inflationRate / 100;
      let futureValue = principal;

      for (let i = 0; i < years * 12; i++) {
        futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
        if (i % 12 === 11) {
          futureValue *= inflationAdjustment;
        }
      }

      return futureValue;
    };

    // Generate projections for different allocation strategies
    const projections = {
      netWorth: PROJECTION_PERIODS.map((period) => {
        const date = new Date();
        const futureYear = date.getFullYear() + period.years;
        // Ensure valid date by using the first of the month
        const projectedDate = new Date(futureYear, 0, 1);
        
        return {
          date: projectedDate.toISOString().split('T')[0],
          conservative: calculateGrowth(
            netWorth,
            financeData.investmentSettings?.monthlyContribution || 0,
            period.years,
            4.5, // Conservative return rate
            financeData.investmentSettings?.inflationRate || 2
          ),
          moderate: calculateGrowth(
            netWorth,
            financeData.investmentSettings?.monthlyContribution || 0,
            period.years,
            7, // Moderate return rate
            financeData.investmentSettings?.inflationRate || 2
          ),
          aggressive: calculateGrowth(
            netWorth,
            financeData.investmentSettings?.monthlyContribution || 0,
            period.years,
            9.5, // Aggressive return rate
            financeData.investmentSettings?.inflationRate || 2
          ),
        };
      }),
      milestones: MILESTONES
        .filter((milestone) => milestone.amount > netWorth)
        .map((milestone) => {
          try {
            const monthlyContribution = financeData.investmentSettings?.monthlyContribution || 0;
            const returnRate = financeData.investmentSettings?.returnRate || 7;
            
            // Avoid division by zero and negative logarithms
            let yearsToMilestone = 0;
            if (monthlyContribution > 0 && returnRate > 0) {
              const monthlyRate = returnRate / 1200;
              const targetGrowth = milestone.amount - netWorth;
              
              if (targetGrowth > 0) {
                yearsToMilestone = Math.log(
                  (targetGrowth * monthlyRate) / monthlyContribution + 1
                ) / Math.log(1 + monthlyRate) / 12;
              }
            }

            const projectedDate = new Date();
            const futureYear = projectedDate.getFullYear() + Math.max(0, Math.ceil(yearsToMilestone));
            // Ensure valid date by using the first of the month
            const milestoneDate = new Date(futureYear, 0, 1);

            return {
              amount: milestone.amount,
              label: milestone.label,
              projectedDate: milestoneDate.toISOString().split('T')[0],
            };
          } catch (error) {
            // Fallback to a far future date if calculation fails
            const fallbackDate = new Date(2100, 0, 1);
            return {
              amount: milestone.amount,
              label: milestone.label,
              projectedDate: fallbackDate.toISOString().split('T')[0],
            };
          }
        }),
    };

    // Calculate monthly investment breakdown
    const monthlyInvestmentProjections = {
      contribution: financeData.investmentSettings?.monthlyContribution || 0,
      taxAdvantaged: (financeData.investmentSettings?.monthlyContribution || 0) * 0.7,
      taxable: (financeData.investmentSettings?.monthlyContribution || 0) * 0.3,
    };

    return {
      monthlyNet,
      totalSavings,
      totalExpenses,
      monthlyExpenses,
      savingsRate,
      debtToIncome,
      netWorth,
      assetAllocation,
      projections,
      monthlyInvestmentProjections,
    };
  }, [financeData]);
}