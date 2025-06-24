"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from '@/services/supabaseClient';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

export default function InterviewDetailsPage() {
  const { interview_id } = useParams();
  const [interview, setInterview] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    if (interview_id) {
      fetchData();
    } 
  }, [interview_id]);

  const fetchData = async () => {
    setLoading(true);hh
    // Fetch interview details
    const { data: interviewData } = await supabase
      .from('Interviews')
      .select('*')
      .eq('interview_id', interview_id)
      .single();
    setInterview(interviewData);

    // Fetch candidates (feedbacks)
    const { data: feedbacks } = await supabase
      .from('interview-feedback')
      .select('*')
      .eq('interviewId', interview_id);
    setCandidates(feedbacks || []);
    setLoading(false);
  };

  useEffect(() => {
    console.log("Fetched feedback:", candidates);
  }, [candidates]);

  if (loading) return <div className="p-8 text-lg animate-pulse font-display text-blue-700">Loading...</div>;
  if (!interview) return <div className="p-8 text-lg text-red-500 font-display">Interview not found.</div>;

  const questionsToShow = showAllQuestions ? interview.questionList : (interview.questionList || []).slice(0, 3);

  // Normalize interviewType to always be an array
  const interviewTypes = Array.isArray(interview.type)
    ? interview.type
    : typeof interview.type === "string" && interview.type.trim() !== ""
      ? interview.type.split(",").map(t => t.trim())
      : ["Not specified"];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl border border-gray-200 mt-10 animate-fade-in-up font-display">
      <div className="mb-8 flex items-center gap-4 animate-fade-in-up">
        <span className="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-xl shadow-lg animate-pulse"></span>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight animate-fade-in-up">Interview Details</h2>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-up">
        <div className="flex-1">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2 tracking-tight animate-fade-in-up">
            {interview.jobPosition}
            <span className="ml-2 px-4 py-1 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full text-xs font-bold shadow animate-bounce">Active</span>
          </h3>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <span className="text-gray-700 text-base font-medium animate-fade-in-up bg-gray-100 px-3 py-1 rounded-full">Created On: <span className="font-bold">{interview.created_at ? new Date(interview.created_at).toLocaleDateString() : ''}</span></span>
            <span className="text-gray-700 text-base font-medium animate-fade-in-up bg-gray-100 px-3 py-1 rounded-full">Duration: <span className="font-bold">{interview.duration}</span></span>
            {interviewTypes.length > 0 && (
              <span className="flex items-center gap-2">
                <span className="text-gray-700 text-base font-medium animate-fade-in-up">Type:</span>
                {interviewTypes.map((type, idx) => (
                  <span
                    key={idx}
                    className={
                      "px-2 py-1 rounded-full text-xs font-bold mr-1 animate-fade-in-up " +
                      (type.toLowerCase() === "technical"
                        ? "bg-blue-200 text-blue-800"
                        : type.toLowerCase() === "behavioral"
                        ? "bg-purple-200 text-purple-800"
                        : "bg-gray-200 text-gray-800")
                    }
                  >
                    {type}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8 animate-fade-in-up">
        <h4 className="font-bold mb-2 text-xl text-blue-700 tracking-tight animate-fade-in-up">Job Description</h4>
        <p className="text-gray-800 text-lg bg-white/80 dark:bg-gray-900/60 rounded-xl p-6 shadow-inner border border-gray-100 dark:border-gray-800 animate-fade-in-up leading-relaxed font-medium">
          {interview.jobDescription}
        </p>
      </div>
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xl text-blue-700 tracking-tight animate-fade-in-up">Interview Questions</h4>
          {interview.questionList && interview.questionList.length > 3 && !showAllQuestions && (
            <Button className="ml-4 font-semibold text-blue-700 border-blue-300 shadow-sm animate-fade-in-up" variant="outline" onClick={() => setShowAllQuestions(true)}>
              View All Questions
            </Button>
          )}
          {showAllQuestions && interview.questionList && interview.questionList.length > 3 && (
            <Button className="ml-4 font-semibold text-purple-700 border-purple-300 shadow-sm animate-fade-in-up" variant="ghost" onClick={() => setShowAllQuestions(false)}>
              Show Less
            </Button>
          )}
        </div>
        <ul className="list-decimal pl-8 text-gray-800 text-lg space-y-3 animate-fade-in-up">
          {questionsToShow && questionsToShow.map((q, i) => (
            <li key={i} className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:bg-gray-800 rounded-lg px-4 py-3 shadow border border-blue-100 dark:border-gray-700 animate-fade-in-up font-semibold">
              {q.question}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6 flex items-center justify-between animate-fade-in-up">
        <h4 className="font-bold text-xl text-blue-700 tracking-tight animate-fade-in-up">Candidates <span className="ml-1 text-gray-600 font-medium">({candidates.length})</span></h4>
      </div>
      <div className="divide-y animate-fade-in-up">
        {candidates.length === 0 && <div className="py-6 text-gray-500 text-lg font-medium">No candidates yet.</div>}
        {candidates.map((c, idx) => (
          <div key={c.id || idx} className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl animate-fade-in-up bg-white/80 dark:bg-gray-900/60 rounded-xl my-3 px-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg animate-fade-in-up border-4 border-white dark:border-gray-800">
                {c.userName ? c.userName[0] : '?'}
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900 dark:text-white tracking-tight animate-fade-in-up">{c.userName || 'Unknown'}</div>
                <div className="text-xs text-gray-500 font-medium animate-fade-in-up">
                  {c.created_at ? `Completed on ${new Date(c.created_at).toLocaleDateString()}` : 'Pending'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              {c.feedback && c.feedback.rating ? (
                <span className="bg-gradient-to-r from-green-200 to-green-400 text-green-900 px-5 py-2 rounded-full font-bold text-lg shadow animate-fade-in-up border border-green-300">
                  {c.feedback.rating.overall || c.feedback.rating.total || c.feedback.rating.score || '8.5'}/10
                </span>
              ) : (
                <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 px-5 py-2 rounded-full font-bold text-lg shadow animate-fade-in-up border border-yellow-300">Pending</span>
              )}
              <Link href={`/dashboard/scheduled-interview/${interview_id}/${c.id}/report`}>
                <Button variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-gray-700 font-bold animate-fade-in-up transition-all duration-200 shadow">
                  View Report
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 