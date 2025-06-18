'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient';

function ScheduledInterviewList() {
    const [interviewList, setInterviews] = useState([]);
    const [candidateCounts, setCandidateCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInterviewList();
    }, []);

    const getInterviewList = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Interviews')
            .select('*')
            .order('id', { ascending: false });
        if (data) {
            setInterviews(data);
            // Fetch candidate counts for each interview
            const counts = {};
            await Promise.all(data.map(async (interview) => {
                const { count } = await supabase
                    .from('interview-feedback')
                    .select('id', { count: 'exact', head: true })
                    .eq('interviewId', interview.interview_id || interview.id);
                counts[interview.interview_id || interview.id] = count || 0;
            }));
            setCandidateCounts(counts);
        } else if (error) {
            console.error('Error fetching interviews:', error);
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-5xl mt-12">
            <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-blue-600 rounded mr-3" />
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
                    Scheduled Interviews
                </h2>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 rounded-full mb-8 ml-2" />
            {loading ? (
                <p>Loading interviews...</p>
            ) : interviewList?.length === 0 ? (
                <div className='p-8 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/70 rounded-xl shadow border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-2'>You don&apos;t have any scheduled interviews yet</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviewList.map((interview) => {
                        const link = `/dashboard/scheduled-interview/${interview.interview_id || interview.id}`;
                        const candidateCount = candidateCounts[interview.interview_id || interview.id] || 0;
                        return (
                            <div key={interview.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-bold">
                                            {interview.jobPosition ? interview.jobPosition[0] : ''}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {interview.created_at ? new Date(interview.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{interview.jobPosition}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{interview.duration}</p>
                                    <p className="text-green-600 font-semibold mb-2">{candidateCount} Candidate{candidateCount !== 1 ? 's' : ''}</p>
                                    <div className="flex gap-3">
                                        <Link href={link} passHref>
                                            <Button variant="outline" className="w-full flex items-center justify-center text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-gray-700">
                                                View Detail <span className="ml-2">&rarr;</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ScheduledInterviewList; 