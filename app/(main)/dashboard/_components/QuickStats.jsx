"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Users, Clock, TrendingUp, Award, Target } from "lucide-react";
import { supabase } from "@/services/supabaseClient";

function StatCard({ icon: Icon, label, value, change, changeType = "positive", loading = false }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-foreground">{value}</p>
          )}
          {change && !loading && (
            <div className={`flex items-center gap-1 text-sm ${
              changeType === "positive" ? "text-emerald-600" : "text-red-500"
            }`}>
              <TrendingUp className={`w-4 h-4 ${changeType === "negative" ? "rotate-180" : ""}`} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          changeType === "positive" 
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600" 
            : "bg-gradient-to-br from-blue-500 to-blue-600"
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function QuickStats() {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalCandidates: 0,
    avgDuration: "0m",
    successRate: "0%",
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch interviews
      const { data: interviews, error: interviewError } = await supabase
        .from('Interviews')
        .select('*');

      // Fetch feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('interview-feedback')
        .select('*');

      if (!interviewError && !feedbackError) {
        const totalInterviews = interviews?.length || 0;
        const totalCandidates = feedback?.length || 0;
        
        // Calculate average duration (mock calculation)
        const avgDuration = totalInterviews > 0 ? "24m" : "0m";
        
        // Calculate success rate based on recommendations
        const recommendedCount = feedback?.filter(f => f.recommended === true).length || 0;
        const successRate = totalCandidates > 0 ? `${Math.round((recommendedCount / totalCandidates) * 100)}%` : "0%";

        setStats({
          totalInterviews,
          totalCandidates,
          avgDuration,
          successRate,
          loading: false
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">Your recruitment metrics at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          label="Total Interviews"
          value={stats.totalInterviews}
          change="+12% from last month"
          changeType="positive"
          loading={stats.loading}
        />
        <StatCard
          icon={Users}
          label="Candidates Screened"
          value={stats.totalCandidates}
          change="+8% from last month"
          changeType="positive"
          loading={stats.loading}
        />
        <StatCard
          icon={Clock}
          label="Avg. Interview Time"
          value={stats.avgDuration}
          change="2m faster than average"
          changeType="positive"
          loading={stats.loading}
        />
        <StatCard
          icon={Award}
          label="Success Rate"
          value={stats.successRate}
          change="+5% from last month"
          changeType="positive"
          loading={stats.loading}
        />
      </div>
    </div>
  );
}

export default QuickStats;