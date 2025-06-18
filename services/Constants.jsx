import { Calendar, Code2Icon, LayoutDashboard, List, Puzzle, Settings, WalletCards, User2Icon, UserPlus, User, BriefcaseBusinessIcon } from "lucide-react";

export const SideBarOptions = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard, 
        path: '/dashboard'
    },
    {
        name: 'Scheduled Interview',
        icon: Calendar,
        path: '/dashboard/scheduled-interview'
    },
    {
        name: 'All Interview',
        icon: List,
        path: '/dashboard/all-interview'
    },
    {
        name: 'Billing',
        icon: WalletCards,
        path: '/dashboard/billing'
    },
    {
        name: 'Setting',
        icon: Settings,
        path: '/dashboard/setting'
    }
];

export const InterviewType = [
    {
        title: 'Technical',
        icon : Code2Icon
    },
    {
        title : 'Behavioral',
        icon : User
    },
    {
        title: 'Experience',
        icon : BriefcaseBusinessIcon
    },
    {
        title : 'Leadership',
        icon : UserPlus
    },
    
    {
        title : 'Problem Solving',
        icon : Puzzle
    }
    
]

export const Questions_prompt = `"You are an expert technical interviewer.

Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions tailored to the duration. Specifically:
- For "5 Min" interviews, generate 3-5 questions.
- For "15 Min" interviews, generate 7-10 questions.
- For "30 Min" interviews, generate 15-20 questions.
- For "45 Min" interviews, generate 20-30 questions.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

Format your response in JSON format with an array list of questions.

format: interviewQuestions=[

{

question:",

type: Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
...
}]

@ The goal is to create a structured, relevant, and time-optimized interview plan for a {(jobTitle}} role.`


export const FEEDBACK_PROMPT = `
{{conversation}}
Depends on this Interview Conversation between assitant and user,
Give me feedback for user interview. Give me rating out of 10 for technical Skills,
Communication, Problem Solving, Experince. Also give me summery in 3 lines
about the interview and one line to let me know whether is recommanded
for hire or not with msg. Give me response in JSON format
{
feedback:{
rating:{
techicalSkills:5,
communication:6,
problemSolving:4,
experince: 7
h
summery:<in 3 Line>,
Recommendation:",
RecommendationMsg:"
}
}`