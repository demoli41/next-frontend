export interface User {
  id: number;
  email: string;
  createdAt: string; 
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Rating {
  id: number; 
  score: number;
  userId: number; 
  recipeId: number; 
  createdAt: string;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  instructions: string;
  ingredients: string;
  creatorId: number;
  creator: { 
    id: number;
    email: string;
  };
  ratings?: Rating[]; 
  createdAt: string;
  updatedAt: string;
}