"use client";

import React from "react";
import { useUser } from "../../../auth/provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, TrendingUp, Users, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/services/supabaseClient";

function StatsCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function WelcomeContainer() {
  const { userDetail } = useUser();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/dashboard/setting");
  };

  const handleAddAccount = () => {
    router.push("/auth");
  };

  const handleSettings = () => {
    router.push("/dashboard/setting");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {greeting}, {userDetail?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to conduct some amazing interviews today?
            </p>
          </div>
          
          {userDetail?.picture && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative">
                  <Image
                    src={userDetail.picture}
                    alt="Profile"
                    width={56}
                    height={56}
                    className="rounded-full border-3 border-white/30 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleProfileClick}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddAccount}>
                  Add Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          icon={Calendar}
          label="Active Interviews"
          value="12"
          trend="+2 this week"
        />
        <StatsCard
          icon={Users}
          label="Total Candidates"
          value="48"
          trend="+8 this week"
        />
        <StatsCard
          icon={Clock}
          label="Avg. Duration"
          value="24m"
        />
        <StatsCard
          icon={TrendingUp}
          label="Success Rate"
          value="87%"
          trend="+5% this month"
        />
      </div>
    </div>
  );
}

export default WelcomeContainer;