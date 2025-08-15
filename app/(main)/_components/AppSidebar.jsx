'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, LogOut, Sparkles } from "lucide-react";
import Image from "next/image";
import { SideBarOptions } from "@/services/Constants";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/auth/provider";
import { supabase } from "@/services/supabaseClient";

export default function AppSidebar() {
  const path = usePathname();  
  const { userDetail } = useUser();
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <Sidebar className="border-r border-border/40 bg-card/50 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/40 p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Recruiter
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Smart Interview Platform
            </p>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => router.push('/dashboard/create-interview')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Interview
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <Link 
                    href={option.path} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-accent/50 ${
                      path === option.path 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-800/50' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <option.icon className={`w-5 h-5 transition-colors ${
                      path === option.path ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-foreground'
                    }`} />
                    <span className="font-medium">{option.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="space-y-4">
          {userDetail && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {userDetail.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userDetail.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{userDetail.email}</p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}