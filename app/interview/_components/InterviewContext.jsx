'use client';

import React, { createContext, useContext, useState } from 'react';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [interviewData, setInterviewData] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  return (
    <InterviewContext.Provider value={{
      interviewData,
      setInterviewData,
      candidateName,
      setCandidateName,
      interviewFeedback,
      setInterviewFeedback
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewContext() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  return context;
} 