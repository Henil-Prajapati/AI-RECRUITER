"use client";

import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import AppSidebar from './_components/AppSidebar';

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;