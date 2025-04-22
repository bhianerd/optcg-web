import React, { useState } from 'react';
import type { Card } from '../../types/types';
import CardComponent from './Card';

interface CardOptionsProps {
  card: Card;
  isTapped?: boolean;
  isSelected?: boolean;
  onPlay?: () => void;
  onTap?: () => void;
  onUntap?: () => void;
  onTrash?: (card: Card) => void;
  onHover?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const CardOptions: React.FC<CardOptionsProps> = ({
  card,
  isTapped = false,
  isSelected = false,
  onPlay,
  onTap,
  onUntap,
  onTrash,
  onHover,
  onMouseLeave,
  className = ''
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleMouseEnter = () => {
    setShowOptions(true);
    if (onHover) {
      onHover();
    }
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`
          transition-transform duration-300 ease-in-out
          ${isTapped ? 'rotate-90' : ''}
          ${className}
        `}
      >
        <CardComponent
          card={card}
          isSelected={isSelected}
        />
      </div>

      {/* Options menu */}
      {showOptions && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg p-2 z-50 w-32">
          {onPlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Play to Field
            </button>
          )}
          {!isTapped && onTap && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTap();
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Tap Card
            </button>
          )}
          {isTapped && onUntap && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUntap();
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Untap Card
            </button>
          )}
          {onTrash && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('CardOptions: Calling onTrash for card:', card);
                onTrash(card);
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Move to Trash
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardOptions;