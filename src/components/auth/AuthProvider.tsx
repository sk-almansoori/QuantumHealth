import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { AuthForm } from './AuthForm';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      useAuthStore.setState({
        user: session?.user ?? null,
        isLoading: false,
      });
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <AuthForm />;
}