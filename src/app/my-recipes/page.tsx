'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyRecipes } from '@/lib/api';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { RevealWrapper } from 'next-reveal';

export default function MyRecipesPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    async function fetchMyRecipes() {
      try {
        setIsLoading(true);
        if (token) {
          const data = await getMyRecipes(token);
          setRecipes(data);
        }
      } catch (err: any) {
        setError(err.message || 'Не вдалося завантажити ваші рецепти.');
        console.error('Error fetching my recipes:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading && user && token) {
      fetchMyRecipes();
    }
  }, [user, token, authLoading, router]);


  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe))
    );
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Перевірка авторизації...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Перенаправлення на сторінку входу...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Завантаження ваших рецептів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Мої Рецепти</h2>
      {recipes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Ви ще не додали жодного рецепта. <Link href="/recipes/add" className="text-blue-600 hover:underline">Додайте перший!</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
                      <RevealWrapper key={recipe.id} delay={index*50}>
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                        />
                      </RevealWrapper>
          ))}
        </div>
      )}
    </div>
  );
}