export interface FinanceData {
  income: {
    monthlyGross: number;
    taxRate: number;
  };
  expenses: {
    fixed: { [key: string]: number };
    variable: { [key: string]: number };
    debt: { [key: string]: number };
  };
  savings: {
    emergency: number;
    retirement: number;
    investment: number;
  };
  assets: {
    cash: number;
    properties: { [key: string]: number };
    investments: {
      stocks: number;
      bonds: number;
      other: number;
    };
  };
  liabilities: {
    mortgages: { [key: string]: number };
    loans: { [key: string]: number };
    creditCards: { [key: string]: number };
  };
  investmentSettings: {
    monthlyContribution: number;
    riskTolerance: "conservative" | "moderate" | "aggressive";
    returnRate: number;
    inflationRate: number;
    taxRate: number;
    accountTypes: {
      taxable: number;
      traditional401k: number;
      rothIra: number;
    };
  };
  projections: {
    milestones: Array<{
      name: string;
      goal: number;
      targetDate: string;
    }>;
  };
  metadata: {
    lastSaved: string;
    lastModified: string;
  };
}

export const defaultFinanceData: FinanceData = {
  income: {
    monthlyGross: 0,
    taxRate: 25,
  },
  expenses: {
    fixed: {},
    variable: {},
    debt: {},
  },
  savings: {
    emergency: 0,
    retirement: 0,
    investment: 0,
  },
  assets: {
    cash: 0,
    properties: {},
    investments: {
      stocks: 0,
      bonds: 0,
      other: 0,
    },
  },
  liabilities: {
    mortgages: {},
    loans: {},
    creditCards: {},
  },
  investmentSettings: {
    monthlyContribution: 0,
    riskTolerance: "moderate",
    returnRate: 7,
    inflationRate: 2,
    taxRate: 25,
    accountTypes: {
      taxable: 0,
      traditional401k: 0,
      rothIra: 0,
    },
  },
  projections: {
    milestones: [
      {
        name: "Set Your First Milestone",
        goal: 0,
        targetDate: "",
      }
    ],
  },
  metadata: {
    lastSaved: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
};

export interface AssetAllocation {
  conservative: { stocks: number; bonds: number };
  moderate: { stocks: number; bonds: number };
  aggressive: { stocks: number; bonds: number };
}

export const ASSET_ALLOCATIONS: AssetAllocation = {
  conservative: { stocks: 20, bonds: 80 },
  moderate: { stocks: 60, bonds: 40 },
  aggressive: { stocks: 80, bonds: 20 },
};

export interface ProjectionPeriod {
  years: number;
  label: string;
}

export const PROJECTION_PERIODS: ProjectionPeriod[] = [
  { years: 5, label: "5 Years" },
  { years: 10, label: "10 Years" },
  { years: 20, label: "20 Years" },
];

export interface Milestone {
  amount: number;
  label: string;
}

export const MILESTONES: Milestone[] = [
  { amount: 10000, label: "$10k Net Worth" },
  { amount: 50000, label: "$50k Net Worth" },
  { amount: 100000, label: "$100k Net Worth" },
  { amount: 250000, label: "$250k Net Worth" },
  { amount: 500000, label: "$500k Net Worth" },
  { amount: 1000000, label: "$1M Net Worth" },
];