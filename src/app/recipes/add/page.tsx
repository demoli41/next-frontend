'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import { useAuth } from '@/context/AuthContext';
import { createRecipe, CreateRecipePayload } from '@/lib/api';

export default function AddRecipePage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (recipeData: CreateRecipePayload) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error('Користувач не авторизований.');
      }
      await createRecipe(recipeData, token);
      router.push('/my-recipes');
    } catch (err: any) {
      setError(err.message || 'Помилка при додаванні рецепта.');
      console.error('Error creating recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Перевірка авторизації...</p>
      </div>
    );
  }

  return <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}