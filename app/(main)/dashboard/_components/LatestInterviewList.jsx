'use client';
import { Button } from '@/components/ui/button';
import { Video, Copy, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient'; // Import Supabase client
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { toast } from 'react-hot-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Toaster } from 'react-hot-toast';

function LatestInterviewList() {
    const [interviewList, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shareOpenId, setShareOpenId] = useState(null);

    useEffect(() => {
        getInterviewList();
    }, []);

    const getInterviewList = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Interviews')
            .select('*')
            .order('id', { ascending: false }); // Order by ID descending to get latest first

        if (data) {
            setInterviews(data);
            console.log('Supabase Data:', data);
        } else if (error) {
            console.error('Error fetching interviews:', error);
        }
        setLoading(false);
    };

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard!');
    };

    const getShareUrl = (platform, link) => {
        if (platform === 'whatsapp') {
            return `https://wa.me/?text=${encodeURIComponent(link)}`;
        }
        if (platform === 'gmail') {
            return `https://mail.google.com/mail/?view=cm&fs=1&to=&su=Interview%20Link&body=${encodeURIComponent(link)}`;
        }
        return '#';
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="w-full max-w-5xl mt-12">
                <div className="flex items-center mb-6">
                    <div className="w-2 h-8 bg-blue-600 rounded mr-3" />
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
                        Previously Created Interviews
                    </h2>
                </div>
                <div className="w-16 h-0.5 bg-gray-300 rounded-full mb-8 ml-2" />
                {loading ? (
                    <p>Loading interviews...</p>
                ) : interviewList?.length === 0 ? (
                    <div className='p-8 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/70 rounded-xl shadow border border-gray-200 dark:border-gray-700'>
                        <Video size={48} className='text-blue-500 mb-4' />
                        <h3 className='text-lg font-semibold text-gray-700 mb-2'>You don&apos;t have any interviews yet</h3>
                        <Link href="/dashboard/create-interview" passHref>
                            <Button className='mt-2 px-6 py-2 text-base font-medium' asChild>
                                <span>Create a New Interview</span>
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviewList.map((interview) => {
                            const link = `${window.location.origin}/interview/${interview.interview_id || interview.id}`;
                            return (
                                <div key={interview.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            {/* Placeholder for Company Logo/Icon */}
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-bold">
                                                {interview.jobPosition ? interview.jobPosition[0] : ''}
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {interview.created_at ? new Date(interview.created_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{interview.jobPosition}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{interview.duration}</p>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-gray-700" onClick={() => handleCopy(link)}>
                                                <Copy className="h-4 w-4 mr-2" /> Copy Link
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                                        <Send className="h-4 w-4 mr-2" /> Send
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <a href={getShareUrl('gmail', link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                            <span role="img" aria-label="Gmail">📧</span> Share via Gmail
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={getShareUrl('whatsapp', link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                            <span role="img" aria-label="WhatsApp">🟢</span> Share via WhatsApp
                                                        </a>
                                                    </DropdownMenuItem>
                                                    {/* Add more share options here */}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default LatestInterviewList