import React from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { InterviewProvider } from './_components/InterviewContext';
// import { InterviewDataContext } from '@/context/InterviewDataContext'

function InterviewLayout({children}) {
    // const [InterviewInfo ,   setIntervieInfo] = useState(); 
  return (
    <InterviewProvider>
    <div>
        <InterviewHeader />
        {children}
    </div>
    </InterviewProvider>
  )
}

export default InterviewLayout