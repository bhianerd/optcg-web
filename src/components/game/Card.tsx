import React, { useState } from 'react';
import type { Card as CardType } from '../../types/types';

interface CardProps {
  card: CardType;
  isFaceDown?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  isFaceDown = false,
  isSelected = false,
  onClick,
  onHover,
  onDragStart,
  onDragEnd,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`
        relative transition-transform duration-200 ease-in-out
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
        ${isHovered ? 'scale-110 z-10' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable={!isFaceDown}
    >
      {isFaceDown ? (
        <div className="w-full h-full bg-blue-900 rounded-lg border-4 border-gray-800" />
      ) : (
        <img
          src={card.img_url}
          alt={card.name}
          className="w-full h-full object-cover rounded-lg"
        />
      )}
      
      {/* Card info overlay on hover */}
      {isHovered && !isFaceDown && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg">
          <div className="text-sm font-bold">{card.name}</div>
          <div className="text-xs">
            {card.type} - {card.color}
            {card.power && ` - Power: ${card.power}`}
            {card.cost && ` - Cost: ${card.cost}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card; 