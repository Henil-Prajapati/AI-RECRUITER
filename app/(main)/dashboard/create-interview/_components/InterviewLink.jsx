'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckCircle2, Clock, ClipboardList, CalendarDays, Mail, MessageSquare, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function InterviewLink({ interviewId, formData, questions }) {
  const router = useRouter();
  const interviewUrl = `${window.location.origin}/interview/${interviewId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(interviewUrl)
      .then(() => {
        toast.success('Interview link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy link.');
      });
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=AI Interview Link&body=Here is your AI Interview link: ${interviewUrl}`, '_blank');
  };

  const handleShareSlack = () => {
    window.open(`https://slack.com/`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://web.whatsapp.com/send?text=Here is your AI Interview link: ${interviewUrl}`, '_blank');
  };

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="p-8 bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <div className="mb-6 flex flex-col items-center">
        <CheckCircle2 className="text-green-500 w-20 h-20 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your AI Interview is Ready!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Share this link with your candidates to start the interview process</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Interview Link</h3>
          <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">Valid for 30 days</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={interviewUrl}
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm"
          >
            <CopyIcon className="h-4 w-4" /> Copy Link
          </Button>
        </div>
        <div className="flex items-center justify-around text-gray-600 dark:text-gray-300 text-sm mt-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {formData.interviewDuration || 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <ClipboardList className="h-4 w-4" /> {questions.length} Questions
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> Expires: {formattedExpiryDate}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Share via</h3>
        <div className="grid grid-cols-3 gap-4">
          <Button onClick={handleShareEmail} variant="outline" className="flex flex-col items-center justify-center p-4 h-auto text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Mail className="h-6 w-6 mb-1" /> Email
          </Button>
          <Button onClick={handleShareSlack} variant="outline" className="flex flex-col items-center justify-center p-4 h-auto text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <MessageSquare className="h-6 w-6 mb-1" /> Slack
          </Button>
          <Button onClick={handleShareWhatsApp} variant="outline" className="flex flex-col items-center justify-center p-4 h-auto text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <MessageCircle className="h-6 w-6 mb-1" /> WhatsApp
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="flex-grow px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </Button>
        <Button
          onClick={() => router.push('/dashboard/create-interview')}
          className="flex-grow px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          + Create New Interview
        </Button>
      </div>
    </div>
  );
}

export default InterviewLink;