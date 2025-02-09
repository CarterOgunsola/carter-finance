"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FinanceData, defaultFinanceData } from "@/types/finance";
import { Plus, Trash2 } from "lucide-react";
import { EditModeWrapper } from "@/components/edit-mode-wrapper";
import { useFinanceCalculations } from "@/hooks/useFinanceCalculations";

const expenseSchema = z.record(z.string().min(0));

const budgetFormSchema = z.object({
  monthlyGross: z.string().min(0),
  taxRate: z.string().min(0),
  fixed: expenseSchema,
  variable: expenseSchema,
  debt: expenseSchema,
});

type FormData = z.infer<typeof budgetFormSchema>;

export function BudgetForm() {
  const [mounted, setMounted] = useState(false);
  const [financeData, setFinanceData] = useLocalStorage<FinanceData>(
    "financeData",
    defaultFinanceData
  );
  const [initialValues, setInitialValues] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      monthlyGross: financeData.income.monthlyGross.toString(),
      taxRate: financeData.income.taxRate.toString(),
      fixed: Object.entries(financeData.expenses.fixed).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
        {}
      ),
      variable: Object.entries(financeData.expenses.variable).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
        {}
      ),
      debt: Object.entries(financeData.expenses.debt).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
        {}
      ),
    },
  });

  useEffect(() => {
    setMounted(true);
    setInitialValues(form.getValues());
  }, []);

  const calculations = useFinanceCalculations(financeData);

  useEffect(() => {
    if (mounted) {
      const formValues = form.getValues();
      const monthlyNet = calculations.monthlyNet;
      const totalExpenses = calculations.totalExpenses;
      
      if (totalExpenses > monthlyNet) {
        form.setError("root", {
          type: "manual",
          message: "Warning: Total expenses exceed monthly net income",
        });
      } else {
        form.clearErrors("root");
      }
    }
  }, [calculations, mounted]);

  if (!mounted) {
    return null;
  }

  const isModified = JSON.stringify(initialValues) !== JSON.stringify(form.getValues());

  function onSubmit(values: FormData) {
    try {
      const now = new Date().toISOString();
      const updatedData: FinanceData = {
        ...financeData,
        income: {
          monthlyGross: parseFloat(values.monthlyGross) || 0,
          taxRate: parseFloat(values.taxRate) || 0,
        },
        expenses: {
          fixed: Object.entries(values.fixed).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: parseFloat(value) || 0 }),
            {}
          ),
          variable: Object.entries(values.variable).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: parseFloat(value) || 0 }),
            {}
          ),
          debt: Object.entries(values.debt).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: parseFloat(value) || 0 }),
            {}
          ),
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
      console.error("Error saving budget:", error);
    }
  }

  const handleCancel = () => {
    if (initialValues) {
      form.reset(initialValues);
    }
  };

  const addExpense = (category: "fixed" | "variable" | "debt") => {
    const currentExpenses = form.watch(category);
    const newKey = `New ${category} expense`;
    form.setValue(category, { ...currentExpenses, [newKey]: "0" });
  };

  const removeExpense = (category: "fixed" | "variable" | "debt", key: string) => {
    const currentExpenses = form.watch(category);
    const { [key]: _, ...rest } = currentExpenses;
    form.setValue(category, rest);
  };

  const renderExpenseCategory = (
    category: "fixed" | "variable" | "debt",
    title: string
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addExpense(category)}
          className="transition-colors hover:bg-muted"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title}
        </Button>
      </div>
      {Object.keys(form.watch(category)).map((key) => (
        <div key={key} className="flex gap-4">
          <FormField
            control={form.control}
            name={`${category}.${key}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={key}
                    className="w-[200px] transition-colors hover:border-primary focus:border-primary"
                    value={key}
                    onChange={(e) => {
                      const value = form.watch(category)[key];
                      const { [key]: _, ...rest } = form.watch(category);
                      form.setValue(category, {
                        ...rest,
                        [e.target.value]: value,
                      });
                    }}
                  />
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Amount"
                      className="transition-colors hover:border-primary focus:border-primary"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExpense(category, key)}
                    className="transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );

  return (
    <EditModeWrapper
      title="Budget"
      onSave={form.handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isModified={isModified}
      lastSaved={financeData.metadata.lastSaved}
    >
      <Form {...form}>
        <form className="space-y-8 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="monthlyGross"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Gross Income</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {renderExpenseCategory("fixed", "Fixed Expenses")}
          {renderExpenseCategory("variable", "Variable Expenses")}
          {renderExpenseCategory("debt", "Debt Payments")}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Real-time Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Monthly Net:</span>
                <span className="ml-2">${calculations.monthlyNet.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Expenses:</span>
                <span className="ml-2">${calculations.totalExpenses.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining:</span>
                <span className={`ml-2 ${calculations.monthlyNet - calculations.totalExpenses < 0 ? 'text-destructive' : ''}`}>
                  ${(calculations.monthlyNet - calculations.totalExpenses).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Savings Rate:</span>
                <span className="ml-2">{calculations.savingsRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="p-4 border border-destructive text-destructive rounded-lg">
              {form.formState.errors.root.message}
            </div>
          )}
        </form>
      </Form>
    </EditModeWrapper>
  );
}