"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FinanceData, defaultFinanceData, ASSET_ALLOCATIONS } from "@/types/finance";
import { useFinanceCalculations } from "@/hooks/useFinanceCalculations";
import { EditModeWrapper } from "@/components/edit-mode-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Suppress Recharts defaultProps warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('defaultProps')) return;
  originalConsoleError.apply(console, args);
};

const planningFormSchema = z.object({
  assets: z.object({
    cash: z.string().min(0),
    investments: z.object({
      stocks: z.string().min(0),
      bonds: z.string().min(0),
      other: z.string().min(0),
    }),
  }),
  investmentSettings: z.object({
    monthlyContribution: z.string().min(0),
    riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
    returnRate: z.string().min(0),
    inflationRate: z.string().min(0),
    taxRate: z.string().min(0),
  }),
});

type FormData = z.infer<typeof planningFormSchema>;

const COLORS = {
  stocks: "hsl(var(--chart-1))",
  bonds: "hsl(var(--chart-2))",
  other: "hsl(var(--chart-3))",
  conservative: "hsl(var(--chart-4))",
  moderate: "hsl(var(--chart-1))",
  aggressive: "hsl(var(--chart-2))",
};

export function FinancialPlanningCalculator() {
  const [mounted, setMounted] = useState(false);
  const [financeData, setFinanceData] = useLocalStorage<FinanceData>(
    "financeData",
    defaultFinanceData
  );
  const [initialValues, setInitialValues] = useState<FormData | null>(null);
  const calculations = useFinanceCalculations(financeData);

  // Initialize form with default values
  const defaultFormValues: FormData = {
    assets: {
      cash: (financeData.assets?.cash || 0).toString(),
      investments: {
        stocks: (financeData.assets?.investments?.stocks || 0).toString(),
        bonds: (financeData.assets?.investments?.bonds || 0).toString(),
        other: (financeData.assets?.investments?.other || 0).toString(),
      },
    },
    investmentSettings: {
      monthlyContribution: (financeData.investmentSettings?.monthlyContribution || 0).toString(),
      riskTolerance: financeData.investmentSettings?.riskTolerance || "moderate",
      returnRate: (financeData.investmentSettings?.returnRate || 7).toString(),
      inflationRate: (financeData.investmentSettings?.inflationRate || 2).toString(),
      taxRate: (financeData.investmentSettings?.taxRate || 25).toString(),
    },
  };

  const form = useForm<FormData>({
    resolver: zodResolver(planningFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    setMounted(true);
    setInitialValues(defaultFormValues);
  }, []);

  if (!mounted) {
    return null;
  }

  const isModified = JSON.stringify(initialValues) !== JSON.stringify(form.getValues());

  function onSubmit(values: FormData) {
    try {
      const now = new Date().toISOString();
      const updatedData: FinanceData = {
        ...financeData,
        assets: {
          ...financeData.assets,
          cash: parseFloat(values.assets.cash) || 0,
          investments: {
            stocks: parseFloat(values.assets.investments.stocks) || 0,
            bonds: parseFloat(values.assets.investments.bonds) || 0,
            other: parseFloat(values.assets.investments.other) || 0,
          },
        },
        investmentSettings: {
          ...financeData.investmentSettings,
          monthlyContribution: parseFloat(values.investmentSettings.monthlyContribution) || 0,
          riskTolerance: values.investmentSettings.riskTolerance,
          returnRate: parseFloat(values.investmentSettings.returnRate) || 7,
          inflationRate: parseFloat(values.investmentSettings.inflationRate) || 2,
          taxRate: parseFloat(values.investmentSettings.taxRate) || 25,
        },
        metadata: {
          ...financeData.metadata,
          lastSaved: now,
          lastModified: now,
        },
      };
      setFinanceData(updatedData);
      setInitialValues(values);
    } catch (error) {
      console.error("Error saving financial planning data:", error);
    }
  }

  const handleCancel = () => {
    if (initialValues) {
      form.reset(initialValues);
    }
  };

  const assetAllocationData = [
    { name: "Stocks", value: calculations.assetAllocation.stocks },
    { name: "Bonds", value: calculations.assetAllocation.bonds },
    { name: "Other", value: calculations.assetAllocation.other },
  ].filter((item) => item.value > 0);

  const projectionsData = calculations.projections.netWorth.map((projection) => ({
    date: new Date(projection.date).getFullYear(),
    Conservative: Math.round(projection.conservative),
    Moderate: Math.round(projection.moderate),
    Aggressive: Math.round(projection.aggressive),
  }));

  return (
    <EditModeWrapper
      title="Financial Planning Calculator"
      onSave={form.handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isModified={isModified}
      lastSaved={financeData.metadata.lastSaved}
    >
      <div className="space-y-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="assets.cash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assets.investments.stocks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stocks</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assets.investments.bonds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bonds</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assets.investments.other"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Investments</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="investmentSettings.monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Contribution</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investmentSettings.riskTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Tolerance</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk tolerance" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investmentSettings.returnRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Return Rate (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investmentSettings.inflationRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inflation Rate (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={assetAllocationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      isAnimationActive={true}
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span className="text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Worth Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projectionsData}
                    margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
                  >
                    <XAxis
                      dataKey="date"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value.toString()}
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      minTickGap={30}
                    />
                    <YAxis
                      type="number"
                      domain={['auto', 'auto']}
                      allowDecimals={false}
                      width={80}
                      tickFormatter={(value) => 
                        new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          style: "currency",
                          currency: "USD",
                        }).format(value)
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                      labelFormatter={(label) => `Year: ${label}`}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="line"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Conservative"
                      stroke={COLORS.conservative}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Moderate"
                      stroke={COLORS.moderate}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Aggressive"
                      stroke={COLORS.aggressive}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Milestone Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {calculations.projections.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted"
                >
                  <div>
                    <div className="font-medium">{milestone.label}</div>
                    <div className="text-sm text-muted-foreground">
                      Target: {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(milestone.amount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Date(milestone.projectedDate).getFullYear()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Projected Year
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </EditModeWrapper>
  );
}