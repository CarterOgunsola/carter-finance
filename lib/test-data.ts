import { FinanceData } from "@/types/finance";

export type FinancialProfile = {
  name: string;
  description: string;
  data: FinanceData;
};

export const financialProfiles: FinancialProfile[] = [
  {
    name: "Entry Level Professional",
    description: "Recent graduate starting their career with student loans",
    data: {
      income: {
        monthlyGross: 4000, // $48,000 annually
        taxRate: 22,
      },
      expenses: {
        fixed: {
          "Rent": 1200,
          "Utilities": 150,
          "Internet": 60,
          "Phone": 80,
          "Insurance": 150,
        },
        variable: {
          "Groceries": 400,
          "Transportation": 200,
          "Entertainment": 200,
          "Shopping": 150,
        },
        debt: {
          "Student Loans": 350,
          "Credit Card": 100,
        },
      },
      savings: {
        emergency: 3000,
        retirement: 5000,
        investment: 2000,
      },
      assets: {
        cash: 4000,
        properties: {},
        investments: {
          stocks: 4000,
          bonds: 2000,
          other: 1000,
        },
      },
      liabilities: {
        mortgages: {},
        loans: {
          "Student Loan": 30000,
        },
        creditCards: {
          "Credit Card": 2000,
        },
      },
      investmentSettings: {
        monthlyContribution: 400,
        riskTolerance: "aggressive",
        returnRate: 8,
        inflationRate: 2,
        taxRate: 22,
        accountTypes: {
          taxable: 2000,
          traditional401k: 3000,
          rothIra: 2000,
        },
      },
      projections: {
        milestones: [
          {
            name: "Emergency Fund",
            goal: 15000,
            targetDate: "2024-12-31",
          },
          {
            name: "Student Loan Payoff",
            goal: 30000,
            targetDate: "2026-12-31",
          },
        ],
      },
      metadata: {
        lastSaved: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    },
  },
  {
    name: "Mid-Career Family",
    description: "Established professional with family and mortgage",
    data: {
      income: {
        monthlyGross: 8500, // $102,000 annually
        taxRate: 24,
      },
      expenses: {
        fixed: {
          "Mortgage": 2200,
          "Utilities": 250,
          "Internet": 80,
          "Phone": 160,
          "Insurance": 400,
          "Childcare": 1200,
        },
        variable: {
          "Groceries": 800,
          "Transportation": 400,
          "Entertainment": 300,
          "Shopping": 300,
          "Healthcare": 200,
        },
        debt: {
          "Mortgage": 2200,
          "Car Loan": 400,
          "Credit Card": 200,
        },
      },
      savings: {
        emergency: 25000,
        retirement: 150000,
        investment: 50000,
      },
      assets: {
        cash: 30000,
        properties: {
          "Primary Home": 450000,
        },
        investments: {
          stocks: 120000,
          bonds: 60000,
          other: 20000,
        },
      },
      liabilities: {
        mortgages: {
          "Primary Home": 380000,
        },
        loans: {
          "Car Loan": 25000,
        },
        creditCards: {
          "Credit Card": 5000,
        },
      },
      investmentSettings: {
        monthlyContribution: 1500,
        riskTolerance: "moderate",
        returnRate: 7,
        inflationRate: 2,
        taxRate: 24,
        accountTypes: {
          taxable: 50000,
          traditional401k: 120000,
          rothIra: 30000,
        },
      },
      projections: {
        milestones: [
          {
            name: "College Fund",
            goal: 100000,
            targetDate: "2030-12-31",
          },
          {
            name: "Retirement",
            goal: 1500000,
            targetDate: "2045-12-31",
          },
        ],
      },
      metadata: {
        lastSaved: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    },
  },
  {
    name: "High Income Professional",
    description: "Senior executive with significant investments",
    data: {
      income: {
        monthlyGross: 20000, // $240,000 annually
        taxRate: 32,
      },
      expenses: {
        fixed: {
          "Mortgage": 4000,
          "Utilities": 400,
          "Internet": 100,
          "Phone": 200,
          "Insurance": 800,
          "Property Tax": 1000,
        },
        variable: {
          "Groceries": 1200,
          "Transportation": 800,
          "Entertainment": 1000,
          "Shopping": 1000,
          "Travel": 2000,
          "Healthcare": 500,
        },
        debt: {
          "Mortgage": 4000,
          "Investment Property": 2000,
        },
      },
      savings: {
        emergency: 100000,
        retirement: 800000,
        investment: 400000,
      },
      assets: {
        cash: 150000,
        properties: {
          "Primary Home": 1200000,
          "Investment Property": 600000,
        },
        investments: {
          stocks: 600000,
          bonds: 300000,
          other: 300000,
        },
      },
      liabilities: {
        mortgages: {
          "Primary Home": 800000,
          "Investment Property": 450000,
        },
        loans: {},
        creditCards: {},
      },
      investmentSettings: {
        monthlyContribution: 5000,
        riskTolerance: "moderate",
        returnRate: 7,
        inflationRate: 2,
        taxRate: 32,
        accountTypes: {
          taxable: 400000,
          traditional401k: 500000,
          rothIra: 200000,
        },
      },
      projections: {
        milestones: [
          {
            name: "Investment Property Portfolio",
            goal: 2000000,
            targetDate: "2028-12-31",
          },
          {
            name: "Early Retirement",
            goal: 5000000,
            targetDate: "2035-12-31",
          },
        ],
      },
      metadata: {
        lastSaved: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    },
  },
  {
    name: "Wealthy Investor",
    description: "High-net-worth individual with diverse investment portfolio",
    data: {
      income: {
        monthlyGross: 83333, // $1,000,000 annually
        taxRate: 37,
      },
      expenses: {
        fixed: {
          "Primary Residence": 12000,
          "Property Management": 3000,
          "Insurance Portfolio": 2500,
          "Private Security": 1500,
          "Staff": 5000,
          "Club Memberships": 2000,
          "Property Tax": 4000,
        },
        variable: {
          "Travel & Leisure": 10000,
          "Fine Dining": 3000,
          "Personal Shopping": 5000,
          "Healthcare & Wellness": 2000,
          "Entertainment": 3000,
          "Charitable Giving": 8000,
          "Family Support": 5000,
        },
        debt: {
          "Primary Residence": 12000,
          "Yacht Loan": 8000,
          "Investment Properties": 15000,
        },
      },
      savings: {
        emergency: 500000,
        retirement: 5000000,
        investment: 8000000,
      },
      assets: {
        cash: 1000000,
        properties: {
          "Primary Residence": 5000000,
          "Beach House": 3000000,
          "Mountain Retreat": 2500000,
          "Investment Property 1": 2000000,
          "Investment Property 2": 1800000,
          "Investment Property 3": 1500000,
        },
        investments: {
          stocks: 4000000,
          bonds: 2000000,
          other: 2000000, // Including private equity, art, collectibles
        },
      },
      liabilities: {
        mortgages: {
          "Primary Residence": 3000000,
          "Beach House": 2000000,
          "Investment Properties": 4000000,
        },
        loans: {
          "Yacht Loan": 1000000,
        },
        creditCards: {},
      },
      investmentSettings: {
        monthlyContribution: 50000,
        riskTolerance: "moderate",
        returnRate: 8,
        inflationRate: 2,
        taxRate: 37,
        accountTypes: {
          taxable: 5000000,
          traditional401k: 2000000,
          rothIra: 1000000,
        },
      },
      projections: {
        milestones: [
          {
            name: "Private Foundation",
            goal: 10000000,
            targetDate: "2026-12-31",
          },
          {
            name: "Legacy Trust",
            goal: 25000000,
            targetDate: "2030-12-31",
          },
          {
            name: "Generational Wealth",
            goal: 50000000,
            targetDate: "2035-12-31",
          },
        ],
      },
      metadata: {
        lastSaved: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    },
  },
];