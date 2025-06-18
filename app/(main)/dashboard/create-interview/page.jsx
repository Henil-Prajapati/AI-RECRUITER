'use client';
import React , {useState} from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress';
import FormContainer from './_components/formcontainer';
import QuestionList from './_components/QuestionList';
import { Toaster } from 'react-hot-toast';
import InterviewLink from './_components/InterviewLink';
// import QuestionList from './_components/QuestionList';


function createinterview() {
    const router = useRouter();
    const [step , setStep] = useState(1);
    const [interviewId, setInterviewId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [formData , setFormData] = useState({
      jobPosition: '',
      jobDescription: '',
      interviewDuration: '',
      interviewType: [], // allow multiple selections
    });

    const onHandleInputChange = (field , value) => {
      if (field === 'interviewType') {
        setFormData(prev => {
          const current = prev.interviewType || [];
          const exists = current.includes(value);
          return {
            ...prev,
            interviewType: exists ? current.filter(v => v !== value) : [...current, value]
          };
        });
      } else {
        setFormData(prev => ({
          ...prev,
          [field] : value
        }));
      }
    }

    console.log("formdata",formData)

    // Progress based on step
    const progressValue = step === 1 ? 50 : step === 2 ? 75 : 100;

  return (
    <div className = 'mt-10 px-10 md:px-24 xl:px:56'>
        <Toaster position="top-right" />
        <div className='flex gap-5 items-center'>
            <ArrowLeft className='mt-1 cursor-pointer' onClick={() => router.back()}/>
                <h2 className='text-2xl font-bold'> Create New Interview</h2>
        </div>
        <Progress value={progressValue} className='my-5' />
        {step === 1 && (
          <FormContainer formData={formData} onHandleInputChange={onHandleInputChange} GoToNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <QuestionList formData={formData} questions={questions} setQuestions={setQuestions} goToStep3={(id) => {setStep(3); setInterviewId(id);}} />
        )}
        {step === 3 && (
          <InterviewLink interviewId={interviewId} formData={formData} questions={questions} />
        )}
    </div>
  )
}

export default createinterview 