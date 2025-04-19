import React from 'react';
import type { Card as CardType } from '../types/types';

interface CardProps {
  card?: CardType;
  isSelected?: boolean;
  isFaceDown?: boolean;
  onClick?: () => void;
  onHover?: () => void;
}

const Card: React.FC<CardProps> = ({ card, isSelected = false, isFaceDown = false, onClick, onHover }) => {
  if (isFaceDown) {
    return (
      <div
        className={`w-full h-full bg-blue-900 rounded-lg border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-800'}`}
        onClick={onClick}
        onMouseEnter={onHover}
      />
    );
  }

  if (!card) return null;

  // Get the local image path
  const imagePath = `/data/en/images/${card.id}.png`;

  return (
    <div
      className={`w-full h-full bg-white rounded-lg border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-800'} overflow-hidden`}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <img
        src={imagePath}
        alt={card.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          // If image fails to load, show a placeholder
          const target = e.target as HTMLImageElement;
          target.src = '/images/card-back.png';
        }}
      />
    </div>
  );
};

export default Card; 