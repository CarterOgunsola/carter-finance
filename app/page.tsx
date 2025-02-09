import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardTabs } from "@/components/dashboard/tabs";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";

export default function Home() {
  return (
    <main className="container mx-auto p-2 sm:p-4 space-y-6 sm:space-y-8 min-h-screen">
      <WelcomeBanner />
      <DashboardHeader />
      <DashboardTabs />
    </main>
  );
}