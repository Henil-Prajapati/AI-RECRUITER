"use client";
import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';

export default function Home() {
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Home: Current user:', user);
    }
    checkUser();
  }, []);

  return <div>Welcome to the app</div>;
}