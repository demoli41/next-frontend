'use client'; 

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import { setAuthToken, getAuthToken, removeAuthToken, setAuthUser, getAuthUser, removeAuthUser } from '@/lib/auth';
import { loginUser, registerUser } from '@/lib/api';
import { FaSpinner } from "react-icons/fa";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getAuthUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const data: AuthResponse = await loginUser(credentials);
      setAuthToken(data.access_token );
      setAuthUser(data.user);
      setToken(data.access_token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: any) => {
    setIsLoading(true);
    try {
      const data: AuthResponse = await registerUser(credentials);
      setAuthToken(data.access_token);
      setAuthUser(data.user);
      setToken(data.access_token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    removeAuthUser();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {isLoading ? ( 
        <div className="flex justify-center items-center animate-spin h-screen"><FaSpinner size={36}/></div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};