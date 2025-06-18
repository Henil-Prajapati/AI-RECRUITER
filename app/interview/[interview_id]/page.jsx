'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { BriefcaseBusiness, Clock, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';   
import { toast } from 'react-hot-toast';
import { useInterviewContext } from '../_components/InterviewContext';

function InterviewDetails() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interview_id;
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState('');
  const [joining, setJoining] = useState(false);

  const { setInterviewData: setContextInterviewData, setCandidateName: setContextCandidateName } = useInterviewContext();

  useEffect(() => {
    if (interviewId) {
      fetchInterviewDetails(interviewId);
    }
  }, [interviewId]);

  const fetchInterviewDetails = async (id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('interview_id', id)
        .single();

      if (error) {
        console.error('Error fetching interview details:', error);
        toast.error('Failed to load interview details.');
        setInterviewData(null);
      } else if (data) {
        setInterviewData(data);
      } else {
        toast.error('Interview not found.');
        setInterviewData(null);
      }
    } catch (e) {
      console.error('Unexpected error fetching interview details:', e);
      toast.error('An unexpected error occurred.');
      setInterviewData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading interview details...</div>;
  }

  if (!interviewData) {
    return <div className="flex justify-center items-center h-screen text-lg">Interview not found or an error occurred.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center py-12 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-10 max-w-2xl w-full text-center border border-gray-200 dark:border-gray-700">
        <div className="mb-8">
          <Image src="/joining.png" alt="AI Interview" width={400} height={250} className="mx-auto mb-6 rounded-3xl shadow-2xl p-8 bg-gray-50 dark:bg-gray-800" />
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">{interviewData.jobPosition} Interview</h2>
          <div className="flex items-start justify-center gap-6 w-full">
            <p className="flex-grow text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-3xl p-6 shadow-sm text-left leading-relaxed max-w-lg">
              {interviewData.jobDescription}
            </p>
            <span className="flex flex-col items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-3xl shadow-sm flex-shrink-0">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">{parseInt(interviewData.duration)}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 leading-none">Min</span>
            </span>
          </div>
        </div>

        <div className="my-8 text-left">
          <label htmlFor="candidateName" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Enter your full name</label>
          <Input
            id="candidateName"
            type="text"
            placeholder="e.g., John Smith"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl mb-8 text-left border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-3">
            <Video className="h-7 w-7 text-blue-600 dark:text-blue-400" /> Before you begin
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 text-base leading-relaxed">
            <li>Ensure you have a stable internet connection</li>
            <li>Test your camera and microphone</li>
            <li>Find a quiet place for the interview</li>
          </ul>
        </div>

        <Button
          onClick={async () => {
            if (interviewData && candidateName.trim() !== '') {
              setJoining(true);
              setContextInterviewData(interviewData);
              setContextCandidateName(candidateName);
              try {
                toast.success('Preparing your interview...!');
                router.push(`/interview/${interviewId}/start`);
              } catch (e) {
                setJoining(false);
              }
            } else {
              toast.error('Please enter your full name to join the interview.');
            }
          }}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out text-lg mb-4 transform hover:-translate-y-1"
          disabled={!candidateName.trim() || joining}
        >
          {joining ? (
            <span className="flex items-center justify-center"><svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Joining...</span>
          ) : (
            <><Video className="h-6 w-6 mr-3" /> Join Interview</>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="w-full py-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
        >
          Test Audio & Video
        </Button>
      </div>
    </div>
  );
}

export default InterviewDetails;