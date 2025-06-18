'use client';

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';

function InterviewCompleted() {
  const params = useParams();
  const interviewId = params.interview_id;
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (interviewId) {
      const fetchFeedback = async () => {
        try {
          const { data, error } = await supabase
            .from('interview-feedback')
            .select('feedback')
            .eq('interviewId', interviewId);

          if (error) {
            if (error.code === 'PGRST116') { 
              setFeedbackData(null);
            } else {
              setError(error.message);
            }
            console.error('Error fetching feedback:', error);
          } else {
            // Check if data array is not empty and get the first element's feedback
            setFeedbackData(data && data.length > 0 ? data[0].feedback : null);
          }
        } catch (err) {
          console.error('Unexpected error fetching feedback:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFeedback();
    }
  }, [interviewId]);

  const renderFeedback = (feedback) => {
    if (!feedback || !feedback.feedback) return <p>No detailed feedback available.</p>;

    const actualFeedback = feedback.feedback; // Access the nested feedback object

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Summary:</h4>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{actualFeedback.summary}</p>
        </div>

        {/* Ratings */}
        {actualFeedback.rating && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Ratings:</h4>
            <ul className="space-y-2">
              {Object.entries(actualFeedback.rating).map(([skill, score]) => (
                <li key={skill} className="flex justify-between items-center">
                  <span className="text-gray-800 dark:text-gray-200 font-medium capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{score}/10</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 text-center max-w-2xl w-full border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 drop-shadow-md">Interview Completed!</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
          Thank you for completing your interview session. We appreciate your time and effort.
          Your feedback is below:
        </p>

        {feedbackData ? (
          <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner text-left overflow-auto max-h-96">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Feedback Details:</h3>
            {renderFeedback(feedbackData)}
          </div>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-6">No feedback found for this interview.</p>
        )}

        {feedbackData && feedbackData.feedback && feedbackData.feedback.Recommendation && (
          <div className="mt-8 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 text-center border border-gray-200 dark:border-gray-700">
            <h3 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">Our Recommendation:</h3>
            <p className={`text-4xl font-bold mb-4 ${feedbackData.feedback.Recommendation === 'Recommended' ? 'text-green-600' : 'text-red-600'}`}>
              {feedbackData.feedback.Recommendation}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{feedbackData.feedback.RecommendationMsg}</p>
          </div>
        )}

        <div className="my-8 flex justify-center">
          <Image 
            src="/feedback.jpeg"
            alt="Feedback illustration"
            width={400}
            height={300}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>

        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewCompleted