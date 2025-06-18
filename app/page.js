"use client";
import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Home: Current user:', user);
      if (user) {
        router.push('/dashboard');
      }
    }
    checkUser();
  }, [router]);

  return <div>Welcome to the app</div>;
}