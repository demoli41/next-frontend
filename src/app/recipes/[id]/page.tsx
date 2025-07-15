
import { getRecipeById } from '@/lib/api';
import { Recipe } from '@/types';
import Link from 'next/link';
import RecipeRatingClient from './RecipeRatingClient'; 

interface RecipeDetailsPageProps {
  params: {
    id: string; 
  };
}

export default async function RecipeDetailsPage({ params }: RecipeDetailsPageProps) {
  const { id } = params;  
  let recipe: Recipe | null = null;
  let error: string | null = null;

  try {
    recipe = await getRecipeById((id));
  } catch (err: any) {
    error = err.message || 'Не вдалося завантажити деталі рецепта.';
    console.error('Error fetching recipe details on server:', err);
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Рецепт не знайдено.</p>
      </div>
    );
  }

  const averageRating = recipe.ratings && recipe.ratings.length > 0
    ? (recipe.ratings.reduce((sum, r) => sum + r.score, 0) / recipe.ratings.length).toFixed(1)
    : 'Немає оцінок';

  return (
    <div className="py-8 px-8 max-w-4xl mx-auto bg-white rounded-lg shadow-xl my-8">

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
      <p className="text-lg text-gray-600 mb-4">Автор: <span className="font-semibold">{recipe.creator.email}</span></p>

      {recipe.description && (
        <p className="text-gray-700 text-base leading-relaxed mb-6">{recipe.description}</p>
      )}

      <div className="flex items-center text-lg text-gray-800 mb-6">
        <span className="font-semibold mr-2">Середній Рейтинг:</span>
        <span className="font-bold text-xl">{averageRating}</span>
        <span className="ml-1 text-yellow-500">⭐</span>
        {recipe.ratings && recipe.ratings.length > 0 && (
          <span className="text-gray-500 ml-2">({recipe.ratings.length} оцінок)</span>
        )}
      </div>


      <RecipeRatingClient initialRecipe={recipe} recipeId={parseInt(id)} />
      <div className='pt-4'>
        <Link href="/recipes" className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200">
                &larr; Назад до рецептів
            </Link>
      </div>
    </div>
  );
}