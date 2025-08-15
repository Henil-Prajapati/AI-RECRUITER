"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar.jsx";
import DashboardProvider from "./provider.js";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardProvider>
        <div className="flex-1">
          {children}  
        </div>
      </DashboardProvider>
    </div>
  );
}