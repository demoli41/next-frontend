'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaPlus } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdStorage } from "react-icons/md";


const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-gray-100 transition duration-300">
          FlavorAI 🍽️
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6">
          {user && (
            <>
              <Link href="/my-recipes" className="text-white hover:text-gray-100 text-lg font-medium transition duration-300 flex items-center">
                <span className="hidden sm:inline">Мої Рецепти</span> 
                <MdStorage className="sm:ml-1" size={20} /> 
              </Link>
              <Link href="/recipes/add" className="text-white hover:text-gray-100 text-lg font-medium transition duration-300 flex items-center">
                <span className="hidden sm:inline">Додати рецепт</span>
                <FaPlus className="sm:ml-1" size={18} /> 
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={logout}
              className="bg-white text-orange-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg hover:bg-gray-100 hover:text-orange-700 transition duration-300 text-lg font-medium flex items-center"
            >
              <span className="hidden sm:inline mr-1">{user.email.split('@')[0]}</span> 
              <IoIosLogOut size={20} /> 
            </button>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-gray-100 text-lg font-medium transition duration-300 flex items-center">
                <span >Увійти</span> 
              </Link>
              <Link href="/register" className="text-white hover:text-gray-100 text-lg font-medium transition duration-300 flex items-center">
                <span >Зареєструватися</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;