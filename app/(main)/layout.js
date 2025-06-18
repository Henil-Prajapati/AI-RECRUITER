"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar.jsx";
import DashboardProvider from "./provider.js";

export default function DashboardLayout({ children }) {
  return (
   <div className='bg-secondary'>
    <DashboardProvider>
      <div className="p-5 mt-0  ">
        {children}  
      </div>
    </DashboardProvider>
   </div>
  );
}