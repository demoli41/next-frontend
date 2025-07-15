'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    try {
      await login({ email, password });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Помилка входу. Спробуйте ще раз.');
      }
    }
  };

  if (isLoading && !user) {
    return <div className="flex justify-center items-center h-screen text-xl">Завантаження...</div>;
  }

  return <AuthForm type="login" onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}