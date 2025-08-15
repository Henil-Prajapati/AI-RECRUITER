"use client";

import { useEffect, useState } from "react";
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewList from "./_components/LatestInterviewList";
import QuickStats from "./_components/QuickStats";
import RecentActivity from "./_components/RecentActivity";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <WelcomeContainer />
        <QuickStats />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <CreateOptions />
            <LatestInterviewList />
          </div>
          <div className="space-y-8">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}