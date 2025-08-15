'use client';
import { Button } from '@/components/ui/button';
import { Video, Copy, Send, Calendar, Clock, Users, MoreVertical } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'react-hot-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Toaster } from 'react-hot-toast';

function LatestInterviewList() {
    const [interviewList, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInterviewList();
    }, []);

    const getInterviewList = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Interviews')
            .select('*')
            .order('id', { ascending: false })
            .limit(6);

        if (data) {
            setInterviews(data);
        } else if (error) {
            console.error('Error fetching interviews:', error);
        }
        setLoading(false);
    };

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success('Interview link copied to clipboard!');
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

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Recent Interviews</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-card rounded-xl p-6 border border-border/50 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-muted rounded-xl" />
                                <div className="w-20 h-4 bg-muted rounded" />
                            </div>
                            <div className="space-y-2">
                                <div className="w-3/4 h-5 bg-muted rounded" />
                                <div className="w-1/2 h-4 bg-muted rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Recent Interviews</h2>
                        <p className="text-muted-foreground mt-1">Your latest interview sessions</p>
                    </div>
                    <Link href="/dashboard/all-interview">
                        <Button variant="outline" className="hover:bg-accent">
                            View All
                        </Button>
                    </Link>
                </div>

                {interviewList?.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Video className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No interviews yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Get started by creating your first AI-powered interview session
                        </p>
                        <Link href="/dashboard/create-interview">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Create Your First Interview
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviewList.map((interview) => {
                            const link = `${window.location.origin}/interview/${interview.interview_id || interview.id}`;
                            return (
                                <div key={interview.id} className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 card-hover overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {interview.jobPosition ? interview.jobPosition[0] : 'I'}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleCopy(link)}>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy Link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={getShareUrl('gmail', link)} target="_blank" rel="noopener noreferrer">
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Share via Email
                                                        </a>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg leading-tight">
                                                    {interview.jobPosition}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {interview.duration}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {interview.created_at ? new Date(interview.created_at).toLocaleDateString() : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/20"
                                                    onClick={() => handleCopy(link)}
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Share
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <a href={getShareUrl('gmail', link)} target="_blank" rel="noopener noreferrer">
                                                                📧 Share via Gmail
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={getShareUrl('whatsapp', link)} target="_blank" rel="noopener noreferrer">
                                                                💬 Share via WhatsApp
                                                            </a>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
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