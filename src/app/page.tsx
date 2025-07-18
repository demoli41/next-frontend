'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllRecipes } from '@/lib/api';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import { FaSearch } from 'react-icons/fa'; 
import { RevealWrapper } from  'next-reveal'

export default function HomePage() {
  const { user, logout } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || 'Не вдалося завантажити рецепти.');
        console.error('Error fetching all recipes on homepage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe))
    );
  };

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) {
      return recipes;
    }
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recipes, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Завантаження рецептів...</p>
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
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 "> 

      <div className="relative w-full max-w-xl mb-12">
        <input
          type="text"
          placeholder="Пошук рецептів..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border bg-white border-gray-300 rounded-3xl shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     focus:shadow-lg transition-all duration-200 text-lg text-gray-800"
          style={{ boxShadow: '0 1px 6px rgba(32,33,36,.28)' }} 
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          {searchTerm ? 'Не знайдено рецептів за вашим запитом.' : 'Наразі немає доданих рецептів.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredRecipes.map((recipe, index) => (
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