'use client';

import React from 'react';
import Link from 'next/link'; 
import { Recipe } from '@/types';


interface RecipeCardProps {
  recipe: Recipe;
  showCreator?: boolean;

}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, showCreator = true}) => {


  const averageRating = recipe.ratings && recipe.ratings.length > 0
    ? (recipe.ratings.reduce((sum, r) => sum + r.score, 0) / recipe.ratings.length).toFixed(1)
    : 'N/A';


  return (
    <Link href={`/recipes/${recipe.id}`} passHref>
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer h-full flex flex-col justify-between">
        <div> 
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">{recipe.description}</p> 
          )}
          <div className="flex items-center text-gray-800 text-sm mb-2">
            <span className="font-medium mr-2">Рейтинг:</span>
            <span className="font-semibold">{averageRating} ⭐</span>
          </div>
          <div className="text-gray-800 text-sm">
            <span className="font-medium">Інгредієнти:</span> {recipe.ingredients.length > 100 ? recipe.ingredients.substring(0, 100) + '...' : recipe.ingredients} 
          </div>
        </div>

      </div>
    </Link>
  );
};

export default RecipeCard;