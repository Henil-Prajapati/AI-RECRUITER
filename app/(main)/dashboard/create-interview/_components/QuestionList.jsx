"use client";

import React, { useEffect, useState } from 'react'
import { Loader2Icon } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Import toast for warnings
import { InterviewType } from '@/services/Constants'; // Import InterviewType
import { supabase } from '@/services/supabaseClient'; // Import Supabase client
import { useUser } from '@/app/auth/provider'; // Import useUser hook
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

function QuestionList({ formData, goToStep3, questions, setQuestions }) {
    console.log("QuestionList: formData on render:", formData); // Debugging line

    const [loading , setLoading] = useState(false);
    const [saving, setSaving] = useState(false); // State for saving data
    // const [questions, setQuestions] = useState([]); // State to store generated questions
    const { userDetail } = useUser(); // Get user details
    const router = useRouter(); // Initialize router

    useEffect(() =>{
        console.log("QuestionList: useEffect triggered with formData:", formData); // Debugging line

        const isFormDataComplete =
            formData && // Ensure formData itself is not null/undefined
            formData.jobPosition && formData.jobPosition.trim() !== '' &&
            formData.jobDescription && formData.jobDescription.trim() !== '' &&
            formData.interviewDuration && formData.interviewDuration.trim() !== '' &&
            Array.isArray(formData.interviewType) && formData.interviewType.length > 0;

        if (isFormDataComplete) {
            GenerateQuestionList();
        } else {
            console.warn('QuestionList: Form data is incomplete. Not generating questions.', formData);
            // Optionally, show a toast here as well if the user somehow lands on this step with incomplete data
            // toast.error('Please complete the previous form step!');
        }
    },[formData])

    const GenerateQuestionList = async () => {
        // Defensive check: ensure formData is valid before making API call
        if (!formData || !formData.jobPosition || !formData.jobDescription || !formData.interviewDuration || !Array.isArray(formData.interviewType) || formData.interviewType.length === 0) {
            console.error("Attempted to generate questions with incomplete formData in GenerateQuestionList.", formData);
            toast.error('Cannot generate questions: missing form data. Please go back and fill all fields.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try { 
            console.log("QuestionList: Sending request with formData:", formData);
            const result = await fetch('/api/ai-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobPosition: formData.jobPosition,
                    jobDescription: formData.jobDescription,
                    duration: formData.interviewDuration,
                    type: formData.interviewType.map(idx => InterviewType[idx]?.title).filter(Boolean).join(', ')
                }),
            });
            
            console.log("QuestionList: Received response status:", result.status, result.statusText);
            if (!result.ok) {
                const errorData = await result.text(); // Read as text for initial debugging
                console.error("QuestionList: API response not OK:", errorData);
                toast.error(`Error from server: ${result.status} ${result.statusText}`);
                setLoading(false);
                return;
            }
            const data = await result.json();
            console.log("QuestionList: API response data:", data); // Log the parsed JSON response
            setQuestions(data.interviewQuestions || []);
            setLoading(false);
        } catch(e){ 
            console.error("QuestionList: Fetch error:", e);
            toast.error('Server Error: Failed to generate questions. Please try again!');
            setLoading(false); 
        }
    }

    const onFinish = async () => {
        setSaving(true); // Set saving state to true
        try {
            const interviewData = {
                jobPosition: formData.jobPosition,
                jobDescription: formData.jobDescription,
                duration: formData.interviewDuration,
                type: formData.interviewType.map(idx => InterviewType[idx]?.title).filter(Boolean).join(', '), // Ensure types are string
                questionList: questions, // The array of generated questions
                userEmail: userDetail?.email, // User's email from context
                interview_id: Date.now().toString(), // Simple unique ID (consider UUID for production)
            };

            const { data, error } = await supabase
                .from('Interviews') // Your Supabase table name
                .insert([interviewData]);

            if (error) {
                console.error("Error saving interview to Supabase:", error);
                toast.error(`Failed to save interview: ${error.message}`);
            } else {
                console.log("Interview saved successfully:", data);
                toast.success('Interview saved successfully!');
                // Redirect to step 3 on success
                if (goToStep3) {
                    const interviewId = interviewData.interview_id; // Get the generated ID
                    goToStep3(interviewId);
                } else {
                    router.push('/dashboard'); // Fallback if goToStep3 is not provided
                }
            }
        } catch (e) {
            console.error("Unexpected error during save:", e);
            toast.error('An unexpected error occurred while saving.');
        } finally {
            setSaving(false); // Always reset saving state
        }
    };

    return (
        <div className="p-8 bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
            {loading ? (
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2Icon className="animate-spin text-blue-500 size-12" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Generating Interview Questions</h2>
                    <p className="text-gray-600 dark:text-gray-300">Our AI is crafting personalized questions based on your job position and description. This may take a moment...</p>
                </div>
            ) : (
                questions.length > 0 ? (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Generated Questions</h2>
                        <ul className="space-y-4">
                            {questions.map((q, index) => (
                                <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{index + 1}. {q.question}</p>
                                    {q.type && <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Type: {q.type}</p>}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={onFinish}
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Finish and Save Interview'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        No questions generated. Please try adjusting your input.
                    </div>
                )
            )}
        </div>
    );
}

export default QuestionList;