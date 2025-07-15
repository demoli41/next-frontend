'use client';

import React, { useState } from 'react';
import { CreateRecipePayload } from '@/lib/api';

interface RecipeFormProps {
  initialData?: CreateRecipePayload; 
  onSubmit: (data: CreateRecipePayload) => void;
  isLoading: boolean;
  error: string | null;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, onSubmit, isLoading, error }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, instructions, ingredients });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {initialData ? 'Редагувати Рецепт' : 'Додати Новий Рецепт'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Назва Рецепту:
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Опис:
          </label>
          <textarea
            id="description"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-gray-700 text-sm font-bold mb-2">
            Інгредієнти (через кому або з нового рядка):
          </label>
          <textarea
            id="ingredients"
            rows={5}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="instructions" className="block text-gray-700 text-sm font-bold mb-2">
            Інструкції (нумерація або маркери):
          </label>
          <textarea
            id="instructions"
            rows={7}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : (initialData ? 'Зберегти Зміни' : 'Додати Рецепт')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;