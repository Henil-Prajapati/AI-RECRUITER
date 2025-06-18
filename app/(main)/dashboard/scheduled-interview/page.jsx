import React from 'react'
import ScheduledInterviewList from '../_components/ScheduledInterviewList';

export default function ScheduledInterviewPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Interview List with Candidate Feedback</h1>
      <ScheduledInterviewList />
    </div>
  );
}