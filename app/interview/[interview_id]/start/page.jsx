'use client';

import React, { useEffect, useState } from 'react';
import { useInterviewContext } from '../../_components/InterviewContext';
import { Mic, PhoneOff, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '../../../auth/provider';

const assistantOptions = {
  name: 'AT Recruiter',
  firstMessage: 'Hi {{UserName}}, how are you? Ready for your interview on {{JobPosition}}?',
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
  },
  language: 'en-us',
  voice: {
    provider: 'playht',
    voiceId: 'Jennifer',
  },
  model: {
    provider: 'openai',
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          You are an AI voice assistant conducting interviews.
          Your job is to ask candidates provided interview questions and assess their responses.
          Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
          "Hey there, {{UserName}}! Welcome to your {{JobPosition}} interview. Let's get started with a few questions!"
          Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions to ask one by one:
          Questions: {{QuestionList}}
          If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
          "Need a hint? Think about how React tracks component updates!"
          Provide brief, encouraging feedback after each answer. Example:
          "Nice! That's a solid answer."
          "Hmm, not quite! Want to try again?"
          Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
          After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
          "That was great! You handled some tough questions well. Keep sharpening your skills!"
          End on a positive note:
          "Thanks for chatting! Hope to see you crushing projects soon!"
          Key Guidelines:
          - Be friendly, engaging, and witty
          - Keep responses short and natural, like a real conversation
          - Adapt based on the candidate's confidence level
          - Ensure the interview remains focused on the provided questions.
        `,
      },
    ],
  },
};

function StartInterviewPage() {
  const { interviewData, candidateName } = useInterviewContext();
  const { userDetail } = useUser();
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const router = useRouter();
  const params = useParams();
  const interviewIdFromUrl = params.interview_id;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [conversation, setConversations] = useState([]);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    let timerInterval;
    if (hasStarted) {
      timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [hasStarted]);

  useEffect(() => {
    console.log('VAPI_PUBLIC_KEY:', process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    console.log('VAPI_ASSISTANT_ID:', process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      console.error('VAPI_PUBLIC_KEY is not set in .env.local!');
      return;
    }
    if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
      console.error('VAPI_ASSISTANT_ID is not set in .env.local! Please create an assistant in Vapi dashboard and add its ID.');
      return;
    }
    if (interviewData && !hasStarted) {
      startCall();
      setHasStarted(true);
    }
  }, [interviewData, hasStarted]);

  const startCall = async () => {
    let formattedQuestionList = '';
    interviewData?.questionList.forEach((item, index) => {
      formattedQuestionList += `${index + 1}. ${item.question}\n`;
      console.log(`Question ${index + 1}: ${item.question}`);
    });

    const assistantOverrides = {
      variableValues: {
        UserName: candidateName || 'Candidate',
        JobPosition: interviewData?.jobPosition || 'the interview',
        QuestionList: formattedQuestionList,
      },
    };

    console.log('Vapi start payload:', {
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      assistantOverrides,
    });

    try {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID, assistantOverrides);
      console.log('Vapi call started successfully');
    } catch (error) {
      console.error('Error starting Vapi call:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  vapi.on("message", (message) => {
    if (message.type === 'assistant-message' || message.type === 'user-message') {
      console.log(`${message.type}: ${message.message.content}`);
    } else if (message.type === 'transcript' || message.type === 'speech_update') {
      console.log(`${message.type}: ${message.transcript.text}`);
    } else if (message.type === 'conversation-update') {
      console.log('conversation-update:', message.conversation);
      setConversations(message.conversation);
    } else {
      console.log(message); // Log other message types for debugging
    }
  });

  const generateFeedback = async () => {
    try {
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation
      });
      console.log('Feedback API response:', result?.data);
      const FINAL_CONTENT = result.data;
      console.log('FINAL_CONTENT:', FINAL_CONTENT);

      // Insert into Supabase
      console.log('Preparing to insert feedback into Supabase:', {
        userName: candidateName,
        userEmail: userDetail?.email,
        interviewId: interviewIdFromUrl,
        feedback: FINAL_CONTENT,
      });

      const { data, error } = await supabase
        .from('interview-feedback')
        .insert([
          {
            userName: candidateName,
            userEmail: userDetail?.email,
            interviewId: interviewIdFromUrl,
            feedback: FINAL_CONTENT,
            recommended: null, // Or derive this from FINAL_CONTENT if possible
          },
        ]).select();

      if (error) {
        console.error('Error inserting feedback into Supabase:', error.message, error);
      } else {
        console.log('Feedback inserted successfully:', data);
        router.replace('/interview/' + interviewIdFromUrl + '/completed');
      }

    } catch (error) {
      console.error('Error generating feedback:', error);
    }
  };

  const handleEndCall = () => {
    setShowConfirmDialog(true);
  };

  const confirmEndCall = async () => {
    setEnding(true);
    try {
      await vapi.stop();
      setShowConfirmDialog(false);
      await generateFeedback();
    } finally {
      // setEnding(false); // Removed to persist loading until navigation
    }
  };

  const cancelEndCall = () => {
    setShowConfirmDialog(false);
  };

  if (!interviewData || !candidateName) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: Interview data or candidate name not found. Please go back and join the interview.
      </div>
    );
  }

  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 flex flex-col font-sans antialiased">
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Mic className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">AIcruiter</h1>
        </div>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-12">
        <div className="flex items-center justify-between w-full max-w-5xl mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm">AI Interview Session</h2>
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-5 py-2 shadow-md">
            <Clock className="h-7 w-7 text-gray-600 dark:text-gray-400" /> {formatTime(elapsedTime)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl flex-grow">
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl opacity-50"></div>
            <Avatar className="h-40 w-40 mb-6 border-4 border-blue-400 shadow-lg">
              <AvatarImage src="/ai.png" alt="AI Recruiter" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 z-10">AI Recruiter</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 z-10">AI-Powered Interviewer</p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl opacity-50"></div>
            <Avatar className="h-40 w-40 mb-6 bg-blue-600 text-white border-4 border-purple-400 shadow-lg">
              <AvatarFallback className="text-6xl font-bold">{getInitials(candidateName)}</AvatarFallback>
            </Avatar>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 z-10">{candidateName}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 z-10">Your Interview Session</p>
          </div>
        </div>

        <div className="mt-16 flex gap-8">
          <Button
            className="relative bg-gray-700 hover:bg-gray-600 text-white rounded-full p-6 h-20 w-20 flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <Mic className="h-10 w-10 transition-colors group-hover:text-blue-300" />
            <span className="absolute bottom-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Mute</span>
          </Button>
          <Button
            className="relative bg-red-600 hover:bg-red-700 text-white rounded-full p-6 h-20 w-20 flex items-center justify-center shadow Harrison transition-all duration-300 transform hover:scale-105 group"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-10 w-10 transition-colors group-hover:text-red-300" />
            <span className="absolute bottom-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">End Call</span>
          </Button>
        </div>

        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50">End Interview?</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to end the call?</p>
              <div className="flex justify-center gap-4">
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmEndCall} disabled={ending}>
                  {ending ? (
                    <span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Ending...</span>
                  ) : (
                    'Yes, End Call'
                  )}
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-900"
                  onClick={cancelEndCall}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StartInterviewPage;