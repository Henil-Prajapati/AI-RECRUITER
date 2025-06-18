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
import Link from "next/link"; // Correct import for routing
import { Plus, Video } from "lucide-react"; // Icon only
import Image from "next/image";
import { SideBarOptions } from "@/services/Constants";
import styles from "./AppSidebar.module.css";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/auth/provider";

export default function AppSidebar() {
    const path = usePathname();  
    const { userDetail } = useUser();
    console.log(path);
  return (
    <Sidebar className={`${styles.appSidebar}`}>
      <SidebarHeader className="flex flex-col items-center mt-5 space-y-4">
        <div className="w-full flex flex-col items-center mb-2 animate-fade-in">
          
        </div>
        <div className="relative w-full flex flex-col items-center">
          <Image src="/logo.png" alt="Logo" width={200} height={100} className="w-[150px] drop-shadow-xl animate-fade-in" />
          <span className="absolute top-2 right-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-bounce">AI</span>
        </div>
        <Button className="w-full flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 animate-fade-in">
          <Plus size={16} />
          Create new Interview
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <Link href={option.path} className="group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-100/60 hover:to-purple-100/60 hover:shadow-md hover:scale-105">
                    <span className={`text-blue-500 group-hover:text-purple-600 transition-colors duration-200 ${path == option.path && 'text-primary'}`}><option.icon /></span>
                    <span className="font-semibold group-hover:text-purple-700 animate-fade-in-up">{option.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full text-center text-xs text-gray-400 py-2 animate-fade-in-down">
          © {new Date().getFullYear()} AI Recruiter
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}