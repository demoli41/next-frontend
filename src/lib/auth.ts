import { User } from '@/types';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'auth_user';

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const setAuthUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getAuthUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeAuthUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};