import { AuthResponse, User } from '@/types'; 
import { Recipe } from '@/types'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options?: ApiOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}


export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  return apiFetch('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (credentials: any): Promise<AuthResponse> => {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};



export interface CreateRecipePayload {
  title: string;
  description?: string;
  instructions: string;
  ingredients: string;
}


export const getAllRecipes = async (): Promise<Recipe[]> => {
  return apiFetch('/recipes');
};


export const getMyRecipes = async (token: string): Promise<Recipe[]> => {
  return apiFetch('/recipes/me', { token });
};


export const createRecipe = async (recipeData: CreateRecipePayload, token: string): Promise<Recipe> => {
  return apiFetch('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
    token,
  });
};


export const getRecipeById = async (id: string): Promise<Recipe> => {
  return apiFetch(`/recipes/${id}`);
};


export const rateRecipe = async (recipeId: number, score: number, token: string): Promise<Recipe> => {
  return apiFetch(`/recipes/${recipeId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ score }),
    token,
  });
};

export const deleteRecipe = async (id: number, token: string): Promise<void> => {
  await apiFetch(`/recipes/${id}`, {
    method: 'DELETE',
    token,
  });
};