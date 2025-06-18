import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from '@/services/Constants';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from 'react-hot-toast';

function FormContainer({ formData, onHandleInputChange , GoToNext }) {
  useEffect(() => {
    if (Array.isArray(formData.interviewType)) {
      const selectedTitles = formData.interviewType
        .map(idx => InterviewType[idx])
        .filter(type => !!type)
        .map(type => type.title);
      console.log('Selected interview types:', selectedTitles);
    }
  }, [formData.interviewType]);

  const isFormComplete =
    formData.jobPosition && formData.jobPosition.trim() !== '' &&
    formData.jobDescription && formData.jobDescription.trim() !== '' &&
    formData.interviewDuration && formData.interviewDuration.trim() !== '' &&
    Array.isArray(formData.interviewType) && formData.interviewType.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) {
      toast.error('Please fill all fields before proceeding!');
      return;
    }
    if (GoToNext) GoToNext();
  };

  return (
    <form
      className="p-8 bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl max-w-2xl mx-auto flex flex-col gap-8 border border-gray-200 dark:border-gray-700 animate-fade-in-up"
      onSubmit={handleSubmit}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold">Job Position</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-blue-500 cursor-help">?</span>
            </TooltipTrigger>
            <TooltipContent>Enter the job title for this interview.</TooltipContent>
          </Tooltip>
        </div>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-1"
          value={formData.jobPosition || ''}
          onChange={e => onHandleInputChange('jobPosition', e.target.value)}
        />
      </div>
      <Separator />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold">Job Description</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-blue-500 cursor-help">?</span>
            </TooltipTrigger>
            <TooltipContent>Describe the responsibilities and requirements for this position.</TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          className="h-32 mt-1"
          placeholder="Enter detailed job description"
          value={formData.jobDescription || ''}
          onChange={e => onHandleInputChange('jobDescription', e.target.value)}
        />
      </div>
      <Separator />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold">Interview Duration</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-blue-500 cursor-help">?</span>
            </TooltipTrigger>
            <TooltipContent>Select the expected duration for the interview.</TooltipContent>
          </Tooltip>
        </div>
        <Select
          value={formData.interviewDuration || ''}
          onValueChange={value => onHandleInputChange('interviewDuration', value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Min</SelectItem>
            <SelectItem value="15 Min">15 Min</SelectItem>
            <SelectItem value="30 Min">30 Min</SelectItem>
            <SelectItem value="45 Min">45 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold">Interview Type</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-blue-500 cursor-help">?</span>
            </TooltipTrigger>
            <TooltipContent>Choose the type of interview to conduct.</TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {InterviewType.map((type, index) => (
            <button
              type="button"
              key={index}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer bg-gradient-to-br
                ${Array.isArray(formData.interviewType) && formData.interviewType.includes(index) ? 'border-blue-500 from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30 scale-105' : 'border-gray-200 dark:border-gray-700 from-white to-gray-100 dark:from-gray-800 dark:to-gray-900'}`}
              onClick={() => onHandleInputChange('interviewType', index)}
              style={{ minWidth: 110 }}
            >
              <type.icon size={36} className="mb-1 text-blue-500 drop-shadow-md" />
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 text-center mt-1">
                {type.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          size="lg"
          className="px-8 text-base font-semibold shadow-md hover:scale-105 transition-transform"
        >
          Generate Question
        </Button>
      </div>
    </form>
  );
}

export default FormContainer;