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
import { EditModeWrapper } from "@/components/edit-mode-wrapper";

const savingsFormSchema = z.object({
  emergency: z.string().min(0),
  retirement: z.string().min(0),
  investment: z.string().min(0),
});

type FormData = z.infer<typeof savingsFormSchema>;

export function SavingsForm() {
  const [mounted, setMounted] = useState(false);
  const [financeData, setFinanceData] = useLocalStorage<FinanceData>(
    "financeData",
    defaultFinanceData
  );
  const [initialValues, setInitialValues] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(savingsFormSchema),
    defaultValues: {
      emergency: financeData.savings.emergency.toString(),
      retirement: financeData.savings.retirement.toString(),
      investment: financeData.savings.investment.toString(),
    },
  });

  useEffect(() => {
    setMounted(true);
    setInitialValues(form.getValues());
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
        savings: {
          emergency: parseFloat(values.emergency) || 0,
          retirement: parseFloat(values.retirement) || 0,
          investment: parseFloat(values.investment) || 0,
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
      console.error("Error saving savings:", error);
    }
  }

  const handleCancel = () => {
    if (initialValues) {
      form.reset(initialValues);
    }
  };

  return (
    <EditModeWrapper
      title="Savings"
      onSave={form.handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isModified={isModified}
      lastSaved={financeData.metadata.lastSaved}
    >
      <Form {...form}>
        <form className="space-y-8 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="emergency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Fund</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retirement Savings</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Portfolio</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </EditModeWrapper>
  );
}