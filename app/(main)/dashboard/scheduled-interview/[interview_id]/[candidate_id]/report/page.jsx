'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';

function CandidateReport() {
  const params = useParams();
  const interviewId = params.interview_id;
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (interviewId) {
      const fetchFeedback = async () => {
        try {
          const { data, error } = await supabase
            .from('interview-feedback')
            .select('id, created_at, userName, userEmail, interviewId, feedback, recommended')
            .eq('interviewId', interviewId);

          if (error) {
            setError(error.message);
            setFeedbackData(null);
          } else if (data && data.length > 0) {
            // Take the first row if multiple are returned
            setFeedbackData(data[0]);
          } else {
            setFeedbackData(null);
          }
        } catch (err) {
          setError(err.message);
          setFeedbackData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchFeedback();
    }
  }, [interviewId]);

  // Progress bar component with animation
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-full h-4 overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-400 h-4 rounded-full animate-grow"
        style={{ width: `${(value / 10) * 100}%`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }}
      ></div>
    </div>
  );

  const handleOfferClick = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/send-offer-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: feedbackData.userEmail,
          name: feedbackData.userName,
          jobRole: innerFeedback.position || 'the position',
        }),
      });
      if (res.ok) setEmailSent(true);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!feedbackData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">No feedback found for this interview.</p>
      </div>
    );
  }

  // Access the nested feedback object
  const innerFeedback = feedbackData.feedback?.feedback || {};
  // Calculate average score if overallScore is not present
  const averageScore = innerFeedback.rating
    ? (Object.values(innerFeedback.rating).reduce((sum, score) => sum + score, 0) / Object.values(innerFeedback.rating).length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-200 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-blue-100 dark:border-gray-800 transition-transform duration-700 ease-out transform hover:scale-[1.02] hover:shadow-3xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Image
                src="/user.png"
                alt="Candidate Avatar"
                width={72}
                height={72}
                className="rounded-full object-cover border-4 border-blue-400 shadow-lg bg-white"
                priority
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">{feedbackData.userName || 'Unknown Candidate'}</h2>
              <p className="text-sm text-blue-500 dark:text-blue-300 font-medium">{feedbackData.userEmail || 'No email provided'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-lg animate-pop">{innerFeedback.overallScore || averageScore}</span>
            <span className="text-base text-gray-400 dark:text-gray-500">/10</span>
          </div>
        </div>

        {/* Skills Assessment */}
        <div className="mb-8 animate-fade-in delay-200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills Assessment</h3>
          <div className="space-y-4">
            {innerFeedback.rating ? (
              Object.entries(innerFeedback.rating).map(([skill, score]) => (
                <div key={skill} className="flex items-center gap-4">
                  <span className="w-40 text-gray-700 dark:text-gray-200 font-medium capitalize">{skill.replace('experince', 'experience')}</span>
                  <div className="flex-1">
                    <ProgressBar value={score || 0} />
                  </div>
                  <span className="w-12 text-right text-blue-600 dark:text-blue-400 font-bold">{score || 0}/10</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No skills assessment available.</p>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mb-8 animate-fade-in delay-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Summary</h3>
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-inner">
            {innerFeedback.summery || innerFeedback.summary || 'No summary available.'}
          </div>
        </div>

        {/* Recommendation Section */}
        {feedbackData.recommended !== null && (
          <div
            className={`p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-lg border-2 transition-all duration-500 animate-fade-in delay-500 ${feedbackData.recommended ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700' : 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'}`}
          >
            <div>
              <h4 className={`text-lg font-bold mb-1 ${feedbackData.recommended ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {feedbackData.recommended ? 'Recommended for Hire' : 'Not Recommended'}
              </h4>
              <p className={`text-base ${feedbackData.recommended ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {innerFeedback.RecommendationMsg || 'No recommendation message available.'}
              </p>
            </div>
            {feedbackData.recommended && (
              <>
                <Button
                  className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-700 text-lg mt-4 md:mt-0 ml-0 md:ml-8 animate-bounce"
                  onClick={handleOfferClick}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Proceed to Offer'}
                </Button>
                {emailSent && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                      <h2 className="text-2xl font-bold mb-4 text-green-600">Email Sent!</h2>
                      <p className="text-gray-700">The candidate will receive their offer notification soon.</p>
                      <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={() => setEmailSent(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Final Recommendation Status Box at the end */}
        {typeof feedbackData.recommended !== 'undefined' && feedbackData.recommended !== null && (
          <div
            className={`mt-8 p-3 rounded-lg text-center w-56 font-bold shadow-md mx-auto animate-fade-in delay-700 border-2 ${feedbackData.recommended ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'}`}
            style={{ boxShadow: '0 4px 24px 0 rgba(59,130,246,0.10), 0 1.5px 4px 0 rgba(59,130,246,0.10)' }}
          >
            {feedbackData.recommended ? 'Recommended' : 'Not Recommended'}
          </div>
        )}
      </div>
      {/* Animations */}
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 1s forwards;
        }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-slide-down {
          opacity: 0;
          transform: translateY(-30px);
          animation: fadeSlideDown 1s forwards;
        }
        @keyframes fadeSlideDown {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-pop {
          animation: popIn 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) both;
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-grow {
          animation: growBar 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes growBar {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default CandidateReport;