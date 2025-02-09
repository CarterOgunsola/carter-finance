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
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const milestoneSchema = z.object({
  name: z.string().min(0),
  goal: z.string().min(0),
  targetDate: z.string().min(0),
});

const projectionsFormSchema = z.object({
  milestones: z.array(milestoneSchema),
});

type FormData = z.infer<typeof projectionsFormSchema>;

export function ProjectionsForm() {
  const [mounted, setMounted] = useState(false);
  const [financeData, setFinanceData] = useLocalStorage<FinanceData>(
    "financeData",
    defaultFinanceData
  );
  const [initialValues, setInitialValues] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(projectionsFormSchema),
    defaultValues: {
      milestones: financeData.projections.milestones.length > 0 
        ? financeData.projections.milestones.map((milestone) => ({
            name: milestone.name,
            goal: milestone.goal.toString(),
            targetDate: milestone.targetDate,
          }))
        : [{
            name: "",
            goal: "0",
            targetDate: "",
          }],
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
        projections: {
          milestones: values.milestones
            .filter(milestone => milestone.name || milestone.goal !== "0" || milestone.targetDate)
            .map((milestone) => ({
              name: milestone.name || "",
              goal: parseFloat(milestone.goal) || 0,
              targetDate: milestone.targetDate || "",
            })),
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
      console.error("Error saving projections:", error);
    }
  }

  const handleCancel = () => {
    if (initialValues) {
      form.reset(initialValues);
    }
  };

  const removeMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    if (currentMilestones.length > 1) {
      const newMilestones = [...currentMilestones];
      newMilestones.splice(index, 1);
      form.setValue("milestones", newMilestones);
    }
  };

  return (
    <EditModeWrapper
      title="Financial Projections"
      onSave={form.handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isModified={isModified}
      lastSaved={financeData.metadata.lastSaved}
    >
      <Form {...form}>
        <form className="space-y-8 p-6">
          {form.watch("milestones").length === 0 && (
            <Card className="p-6 text-center bg-muted/50">
              <p className="text-muted-foreground">
                No milestones set yet. Add your first financial milestone to start tracking your goals.
              </p>
            </Card>
          )}
          
          <div className="space-y-6">
            {form.watch("milestones").map((_, index) => (
              <div key={index} className="relative p-6 border rounded-lg bg-card">
                <div className="absolute right-4 top-4">
                  {form.watch("milestones").length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMilestone(index)}
                      className="transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Milestone Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g., Emergency Fund, House Down Payment"
                            className="transition-colors hover:border-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.goal`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Amount</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="Enter target amount"
                            className="transition-colors hover:border-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.targetDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            className="transition-colors hover:border-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              form.setValue("milestones", [
                ...form.watch("milestones"),
                { name: "", goal: "0", targetDate: "" },
              ])
            }
            className="transition-colors hover:bg-muted"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Milestone
          </Button>
        </form>
      </Form>
    </EditModeWrapper>
  );
}