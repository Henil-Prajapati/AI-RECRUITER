"use client";

import { supabase } from '@/services/supabaseClient';
import React, { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '../../context/UserDetailContext';

function Provider({ children }) {
  console.log('Provider: Component rendered at', new Date().toISOString());

  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('fetchUser: Starting at', new Date().toISOString());
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.log('fetchUser: No user session found:', error.message);
          setUserDetail(null);
          return;
        }
        if (user) {
          console.log('fetchUser: User found:', user.email, user.user_metadata);
          await syncUserWithDatabase(user);
        }
      } catch (err) {
        console.error('fetchUser: Error:', err.message);
        setUserDetail(null);
      }
    };

    const syncUserWithDatabase = async (user) => {
      console.log('syncUserWithDatabase: Querying Users table for email:', user.email);
      try {
        const { data: users, error: selectError } = await supabase
          .from('Users')
          .select('*')
          .eq('email', user.email);
        console.log(users, 'user');
        if (selectError) {
          console.error('syncUserWithDatabase: Error fetching users:', selectError.message);
          return;
        }
        console.log('syncUserWithDatabase: Query result:', users);
        if (users.length === 0) {
          console.log('syncUserWithDatabase: No user found, inserting new user');
          const { data, error: insertError } = await supabase.from('Users').insert([
            {
              name: user.user_metadata?.name || 'Unknown',
              email: user.email,
              picture: user.user_metadata?.picture || '',
            },
          ]);
          if (insertError) {
            console.error('syncUserWithDatabase: Error inserting user:', insertError.message);
          } else {
            console.log('syncUserWithDatabase: New user inserted:', data);
            setUserDetail({
              name: user.user_metadata?.name || 'Unknown',
              email: user.email,
              picture: user.user_metadata?.picture || '',
            });
          }
        } else {
          console.log('syncUserWithDatabase: User already exists:', users[0]);
          setUserDetail(users[0]);
        }
      } catch (err) {
        console.error('syncUserWithDatabase: Error:', err.message);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('onAuthStateChange: Event:', event, 'Session user:', session?.user?.email);
      if (event === 'SIGNED_IN' && session?.user) {
        syncUserWithDatabase(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUserDetail(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const testInsert = async () => {
    console.log('testInsert: Starting at', new Date().toISOString());
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.log('testInsert: No user logged in');
        alert('No user logged in');
        return;
      }
      const newUser = {
        name: user.user_metadata?.name || 'Test User',
        email: user.email,
        picture: user.user_metadata?.picture || 'test.jpg',
      };
      const { data, error: insertError } = await supabase.from('Users').insert([newUser]);
      console.log('testInsert: Result:', data, 'Error:', insertError);
      if (insertError) {
        alert(`Failed to insert user: ${insertError.message}`);
      } else {
        setUserDetail(newUser);
        alert('User inserted successfully!');
      }
    } catch (err) {
      console.error('testInsert: Error:', err.message);
      alert('Error inserting user');
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail, testInsert }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error('useUser must be used within a UserDetailContext.Provider');
  }
  return context;
};