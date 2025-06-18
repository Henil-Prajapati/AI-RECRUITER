"use client";

import Image from 'next/image'; 
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import React from 'react';
import { useUser } from './provider';
import { useRouter } from 'next/navigation';

async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`, // Redirect to root (/) after auth
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
  }
}

function Home() {
  const { userDetail, testInsert } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (userDetail) {
      router.push('/dashboard');
    }
  }, [userDetail, router]);

  console.log('Home: UserDetail from context:', userDetail);

  if (!userDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-screen border rounded-2xl bg-gray-100 p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={45}
            style={{ height: 'auto' }}
          />
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6">
            <Image
              src="/login.png"
              alt="Login"
              width={400}
              height={250}
              style={{ height: 'auto' }}
              className="rounded-2xl"
            />
            <h1 className="text-2xl font-bold text-center mt-4">Login to Your Account</h1>
            <p className="text-gray-600 text-center mt-2">Please enter your credentials to continue.</p>
            <Button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition duration-200"
              onClick={signInWithGoogle}
            >
              Login with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userDetail.name || 'User'}!</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        {userDetail.picture && (
          <Image
            src={userDetail.picture}
            alt="Profile"
            width={100}
            height={100}
            style={{ height: 'auto' }}
            className="rounded-full mb-4"
          />
        )}
        <p className="text-lg">Email: {userDetail.email}</p>
        <p className="text-lg">Name: {userDetail.name || 'Unknown'}</p>
        <Button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-blue-800 transition duration-200"
          onClick={testInsert}
        >
          Test Insert to Users Table
        </Button>
        <Button
          className="mt-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition duration-200"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Home;