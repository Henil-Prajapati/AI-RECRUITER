"use client";

import React from "react";
import { useUser } from "../../../auth/provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/services/supabaseClient";

function WelcomeMessage({ name, picture, onProfileClick, onLogout, onAddAccount, onSettings }) {
  return (
    <div className="w-full bg-white/80 dark:bg-gray-900/70 rounded-lg shadow p-4 mt-1 ml-11 flex flex-col items-center border border-gray-200 dark:border-gray-700 relative">
      {picture && (
        <div className="absolute top-3 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={picture}
                alt="userAvatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-blue-400 shadow cursor-pointer hover:scale-105 transition-transform"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 min-w-[180px]">
              <DropdownMenuItem onClick={onProfileClick}>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={onAddAccount}>Add Account</DropdownMenuItem>
              <DropdownMenuItem onClick={onSettings}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow mb-1 w-full">
        Welcome back, {name}!
      </h2>
      <p className="text-base font-medium bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent tracking-wide w-full">
        Ai-Driven Interviews, Hassle-Free Hiring
      </p>
    </div>
  );
}

function WelcomeContainer() {
  const { userDetail, testInsert } = useUser();
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

  return (
    <div className="w-full max-w-5xl flex flex-col items-start mt-2 animate-fade-in">
      {userDetail ? (
        <WelcomeMessage
          name={userDetail.name?.split(" ")[0] || "User"}
          picture={userDetail.picture}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onAddAccount={handleAddAccount}
          onSettings={handleSettings}
        />
      ) : (
        <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-2" />
      )}
    </div>
  );
}

export default WelcomeContainer;