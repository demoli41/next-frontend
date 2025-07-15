'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import RatingStars from '@/components/RatingStars';
import { rateRecipe } from '@/lib/api';
import { Recipe } from '@/types';

// Інтерфейс для пропсів компонента
interface RecipeRatingClientProps {
  initialRecipe: Recipe;
  recipeId: number;
}

// Допоміжна функція для розділення інструкцій на кроки
const splitInstructionsIntoList = (text: string): string[] => {
  if (!text) return [];
  const lines = text.split(/(\d+\.\s*|•\s*|-\s*|\*\s*|\n)/g).filter(Boolean);
  const result: string[] = [];
  let currentItem = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const isMarker = line.match(/^\d+\.$|^•$|^-$|^\*$/);
    if (isMarker) {
      if (currentItem) result.push(currentItem.trim());
      currentItem = line + ' ';
    } else if (line === '\n') {
      if (currentItem) {
        result.push(currentItem.trim());
        currentItem = '';
      }
    } else {
      currentItem += line + ' ';
    }
  }
  if (currentItem) result.push(currentItem.trim());
  return result.filter(item => item.trim() !== '');
};

// Допоміжна функція для розділення інгредієнтів
const splitIngredientsByComma = (text: string): string[] => {
  if (!text) return [];
  return text.split(',').map(item => item.trim()).filter(item => item !== '');
};

// Основний компонент
export default function RecipeRatingClient({ initialRecipe, recipeId }: RecipeRatingClientProps) {
  const { user, token } = useAuth();
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [checkedInstructions, setCheckedInstructions] = useState<Map<number, boolean>>(() => {
    const initialMap = new Map<number, boolean>();
    if (initialRecipe && initialRecipe.instructions) {
      const instructionsArray = splitInstructionsIntoList(initialRecipe.instructions);
      instructionsArray.forEach((_, index) => initialMap.set(index, false));
    }
    return initialMap;
  });

  // Встановлення початкового рейтингу користувача, якщо він є
  useEffect(() => {
    if (user && recipe.ratings) {
      const foundRating = recipe.ratings.find(r => r.userId === user.id);
      setUserRating(foundRating ? foundRating.score : 0);
    } else {
      setUserRating(0);
    }
  }, [user, recipe.ratings]);

  // Функція для оцінювання рецепта з обробкою помилок
  const handleRate = async (score: number) => {
    if (!user || !token) {
      setRatingMessage('Будь ласка, увійдіть, щоб оцінити рецепт.');
      return;
    }
    setRatingMessage(null); // Скидаємо попереднє повідомлення

    try {
      // Робимо запит до API
      const updatedRecipe = await rateRecipe(recipeId, score, token);
      setRecipe(updatedRecipe);
      setUserRating(score);
      setRatingMessage('Ваша оцінка успішно збережена!');
    } catch (err: any) {
      // ✅ **Ось ключова частина!**
      // Ловимо помилку, яку кидає `api.ts`, і показуємо її повідомлення
      setRatingMessage(err.message || 'Сталася невідома помилка.');
      console.error('Помилка при оцінюванні рецепта:', err);
    }
  };

  // Обробник для чекбоксів інструкції
  const handleCheckboxChange = (index: number) => {
    setCheckedInstructions(prev => {
      const newMap = new Map(prev);
      newMap.set(index, !newMap.get(index));
      return newMap;
    });
  };

  const ingredientsList = splitIngredientsByComma(recipe.ingredients || '');
  const instructionsList = splitInstructionsIntoList(recipe.instructions || '');

  return (
    <div className="">
      {/* Секція інгредієнтів */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Інгредієнти:</h3>
        {ingredientsList.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {ingredientsList.map((item, index) => (
              <li key={index} className="pl-2">{item.trim()}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">Інгредієнти не вказано.</p>
        )}
      </div>

      {/* Секція інструкцій */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Інструкція:</h3>
        {instructionsList.length > 0 ? (
          <div className="space-y-3">
            {instructionsList.map((instruction, index) => (
              <div key={index} className="flex items-start">
                <input
                  type="checkbox"
                  id={`instruction-${index}`}
                  checked={checkedInstructions.get(index) || false}
                  onChange={() => handleCheckboxChange(index)}
                  style={{ accentColor: '#f97316' }}
                  className="mt-1 h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor={`instruction-${index}`}
                  className={`ml-3 text-lg text-gray-700 leading-relaxed cursor-pointer ${
                    checkedInstructions.get(index) ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {instruction.replace(/^\d+\.\s*|^•\s*|-\s*|^\*\s*/, '')}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">Інструкції не вказано.</p>
        )}
      </div>

      {/* Секція оцінювання */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Оцініть цей рецепт:</h3>
        {user ? (
          <>
            <div className="flex items-center space-x-4 mb-4">
              <RatingStars initialRating={userRating} onRate={handleRate} size={30} />
              {ratingMessage && (
                <p className={`text-sm font-medium ${ratingMessage.includes('успішно') ? 'text-green-600' : 'text-red-500'}`}>
                  {ratingMessage}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-lg">
            Будь ласка, <Link href="/login" className="text-orange-600 hover:underline">увійдіть</Link>, щоб оцінити цей рецепт.
          </p>
        )}
      </div>
    </div>
  );
}