import type React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addCardToDeck } from '../../redux/slices/deckBuilderSlice';
import type { Card } from '../../types/types';

type CardItemProps = {
  card: Card;
  showAddButton?: boolean;
}
const CardItem: React.FC<CardItemProps> = ({ card, showAddButton = true }) => {
  const dispatch = useAppDispatch();
  
  const handleAddCard = () => {
    dispatch(addCardToDeck(card));
  };
  
  const colorClassMap = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-600',
    black: 'bg-gray-800'
  };
  
  const colorClass = colorClassMap[card.color as keyof typeof colorClassMap] ?? 'bg-gray-500';
  
  return (
    <div className="card-item p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className={`card-header px-2 py-1 rounded ${colorClass} text-white flex justify-between items-center`}>
        <span className="text-xs font-bold">{card.name}</span>
        <span className="text-xs">Cost: {card.cost}</span>
      </div>
      
      <div className="card-body p-2">
        <div className="card-image-placeholder h-20 bg-gray-200 flex items-center justify-center mb-1 rounded">
          <span className="text-xs text-gray-600">[Card Image]</span>
        </div>
        
        <div className="card-info text-xs">
          <div className="flex justify-between">
            <span>{card.type}</span>
            {card.power && <span>Power: {card.power}</span>}
          </div>
          <div className="flex justify-between mt-1">
            <span>{card.set}</span>
            <span className="text-purple-600">{card.rarity}</span>
          </div>
          <div className="card-effect mt-1 text-gray-700 italic text-xs h-12 overflow-y-auto">
            {card.effect}
          </div>
        </div>
      </div>
      
      {showAddButton && (
        <div className="card-actions mt-2">
          <button
            onClick={handleAddCard}
            className="w-full py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
          >
            Add to Deck
          </button>
        </div>
      )}
    </div>
  );
};

export default CardItem;