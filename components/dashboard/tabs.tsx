"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BudgetForm } from "@/components/forms/budget-form";
import { SavingsForm } from "@/components/forms/savings-form";
import { ProjectionsForm } from "@/components/forms/projections-form";
import { FinancialPlanningCalculator } from "@/components/financial-planning/calculator";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="budget" className="space-y-4">
      <TabsList className="w-full flex flex-wrap justify-start gap-2">
        <TabsTrigger 
          value="budget"
          className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/60"
        >
          Budget
        </TabsTrigger>
        <TabsTrigger 
          value="savings"
          className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/60"
        >
          Savings
        </TabsTrigger>
        <TabsTrigger 
          value="projections"
          className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/60"
        >
          Projections
        </TabsTrigger>
        <TabsTrigger 
          value="planning"
          className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/60"
        >
          Financial Planning
        </TabsTrigger>
      </TabsList>
      <TabsContent value="budget">
        <Card className="p-2 sm:p-6">
          <BudgetForm />
        </Card>
      </TabsContent>
      <TabsContent value="savings">
        <Card className="p-2 sm:p-6">
          <SavingsForm />
        </Card>
      </TabsContent>
      <TabsContent value="projections">
        <Card className="p-2 sm:p-6">
          <ProjectionsForm />
        </Card>
      </TabsContent>
      <TabsContent value="planning">
        <Card className="p-2 sm:p-6">
          <FinancialPlanningCalculator />
        </Card>
      </TabsContent>
    </Tabs>
  );
}