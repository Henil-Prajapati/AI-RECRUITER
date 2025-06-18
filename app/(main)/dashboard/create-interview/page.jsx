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
    const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

    // Stepper labels
    const steps = [
      { label: 'Job Details', icon: '📝' },
      { label: 'AI Questions', icon: '🤖' },
      { label: 'Share Link', icon: '🔗' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 flex flex-col items-center justify-center py-10 px-2 animate-fade-in">
        <Toaster position="top-right" />
        <div className="max-w-3xl w-full mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((s, idx) => (
              <div key={s.label} className="flex flex-col items-center relative">
                <div className={`rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg border-4 transition-all duration-300
                  ${step === idx + 1 ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border-purple-400 scale-110' : 'bg-white text-blue-500 border-gray-200'}`}>{s.icon}</div>
                <span className={`mt-2 text-sm font-semibold ${step === idx + 1 ? 'text-purple-700' : 'text-gray-400'}`}>{s.label}</span>
                {idx < steps.length - 1 && (
                  <div className="absolute left-1/2 top-6 w-24 h-1 bg-gradient-to-r from-blue-300 to-purple-300 -z-10" style={{ transform: 'translateX(24px)' }} />
                )}
              </div>
            ))}
          </div>
          {/* Glassmorphism Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 backdrop-blur-xl transition-all duration-500 animate-fade-in-up">
            <div className='flex gap-5 items-center mb-6'>
              <ArrowLeft className='mt-1 cursor-pointer text-blue-500 hover:text-purple-600 transition-colors' size={28} onClick={() => router.back()}/>
              <h2 className='text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow'>Create New Interview</h2>
            </div>
            <Progress value={progressValue} className='my-5 h-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100' />
            <div className="transition-all duration-500">
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
          </div>
        </div>
      </div>
    );
}

export default createinterview 