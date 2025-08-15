"use client";

import React, { useEffect, useState } from "react";
import { Clock, User, CheckCircle, XCircle, Calendar } from "lucide-react";
import { supabase } from "@/services/supabaseClient";

function ActivityItem({ icon: Icon, title, description, time, type = "default" }) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20";
      case "warning":
        return "text-amber-600 bg-amber-50 dark:bg-amber-950/20";
      case "error":
        return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default:
        return "text-blue-600 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeStyles()}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs mt-1">{description}</p>
        <p className="text-muted-foreground text-xs mt-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {time}
        </p>
      </div>
    </div>
  );
}

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent interviews
      const { data: interviews, error: interviewError } = await supabase
        .from('Interviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('interview-feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!interviewError && !feedbackError) {
        const activityList = [];

        // Add interview activities
        interviews?.forEach(interview => {
          activityList.push({
            id: `interview-${interview.id}`,
            icon: Calendar,
            title: "New Interview Created",
            description: `${interview.jobPosition} interview is ready`,
            time: formatTimeAgo(interview.created_at),
            type: "default",
            timestamp: new Date(interview.created_at)
          });
        });

        // Add feedback activities
        feedback?.forEach(fb => {
          activityList.push({
            id: `feedback-${fb.id}`,
            icon: fb.recommended ? CheckCircle : XCircle,
            title: "Interview Completed",
            description: `${fb.userName} completed their interview`,
            time: formatTimeAgo(fb.created_at),
            type: fb.recommended ? "success" : "warning",
            timestamp: new Date(fb.created_at)
          });
        });

        // Sort by timestamp and take top 5
        activityList.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(activityList.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-muted-foreground text-sm mt-1">Latest updates from your interviews</p>
      </div>
      
      <div className="p-2">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                icon={activity.icon}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                type={activity.type}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-muted-foreground text-sm mt-1">
              Create your first interview to see activity here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivity;