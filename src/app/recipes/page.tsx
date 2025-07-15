'use client';

import React, { useState, useEffect, useMemo } from 'react'; 
import { getAllRecipes } from '@/lib/api';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';

export default function AllRecipesPage() {
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
        console.error('Error fetching all recipes:', err);
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
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Всі Рецепти</h2>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Пошук за назвою рецепта..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          {searchTerm ? 'Не знайдено рецептів за вашим запитом.' : 'Наразі немає доданих рецептів.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}