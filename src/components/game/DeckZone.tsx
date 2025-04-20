import React, { useState } from 'react';
import type { Card } from '../../types/types';
import CardComponent from './Card';

interface DeckZoneProps {
  deck: Card[];
  onDraw?: () => void;
  onShuffle?: () => void;
  onViewTop?: () => void;
}

const DeckZone: React.FC<DeckZoneProps> = ({
  deck,
  onDraw,
  onShuffle,
  onViewTop
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div 
      className="relative w-20"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="w-20 h-28 cursor-pointer">
        <CardComponent isFaceDown />
        <span className="text-white text-sm">DECK ({deck.length})</span>
      </div>

      {/* Dropdown menu */}
      {showOptions && deck.length > 0 && (
        <div className="absolute left-full ml-2 top-0 bg-white rounded-lg shadow-lg p-2 z-50 w-32">
          <button
            onClick={onDraw}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Draw Card
          </button>
          <button
            onClick={onShuffle}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Shuffle Deck
          </button>
          <button
            onClick={onViewTop}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            View Top Card
          </button>
        </div>
      )}
    </div>
  );
};

export default DeckZone; 