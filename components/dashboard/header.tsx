"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { WalletCards } from "@/components/wallet-cards";
import { Settings, Wallet, Trash2, FileInput } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { financialProfiles } from "@/lib/test-data";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FinanceData, defaultFinanceData } from "@/types/finance";

export function DashboardHeader() {
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const { toast } = useToast();
  const [, setFinanceData] = useLocalStorage<FinanceData>(
    "financeData",
    defaultFinanceData
  );

  const handleClearData = () => {
    try {
      localStorage.clear();
      window.location.reload();
      toast({
        title: "Data cleared successfully",
        description: "All your financial data has been reset.",
      });
    } catch (error) {
      toast({
        title: "Error clearing data",
        description:
          "There was a problem clearing your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadTestData = (profileIndex: number) => {
    try {
      const profile = financialProfiles[profileIndex];
      setFinanceData(profile.data);
      window.location.reload();
      toast({
        title: "Test data loaded",
        description: `Loaded ${profile.name} profile successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error loading test data",
        description:
          "There was a problem loading the test data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            The Carter Finance Tool
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="transition-colors hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer transition-colors hover:bg-muted">
                  <FileInput className="mr-2 h-4 w-4" />
                  Load Test Data
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {financialProfiles.map((profile, index) => (
                    <DropdownMenuItem
                      key={profile.name}
                      onClick={() => loadTestData(index)}
                      className="cursor-pointer transition-colors hover:bg-muted"
                    >
                      <div className="flex flex-col">
                        <span>{profile.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {profile.description}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer transition-colors hover:bg-destructive/10"
                onClick={() => setShowClearDataDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="cursor-pointer transition-colors hover:bg-muted"
              >
                <a
                  href="https://github.com/CarterOgunsola/carter-finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  View Source
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
      <WalletCards />

      <AlertDialog
        open={showClearDataDialog}
        onOpenChange={setShowClearDataDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your financial data and reset the application to its default
              state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-2 sm:mt-0 transition-colors hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-destructive hover:bg-destructive/90 transition-colors"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
