'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; 

interface RatingStarsProps {
  initialRating: number;
  onRate: (score: number) => void;
  readOnly?: boolean; 
  size?: number; 
}

const RatingStars: React.FC<RatingStarsProps> = ({ initialRating, onRate, readOnly = false, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  const handleStarClick = (score: number) => {
    if (readOnly) return;
    setCurrentRating(score);
    onRate(score);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((score) => (
        <FaStar
          key={score}
          size={size}
          className={`cursor-pointer transition-colors duration-200
            ${(hoverRating || currentRating) >= score ? 'text-yellow-400' : 'text-gray-300'}`}
          onMouseEnter={() => !readOnly && setHoverRating(score)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          onClick={() => handleStarClick(score)}
        />
      ))}
    </div>
  );
};

export default RatingStars;