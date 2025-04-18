import React from 'react';
import { Card } from '../types/types';
import CardDisplay from './CardDisplay';

interface CardGridProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  selectedCardIds?: string[];
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onCardClick, selectedCardIds = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {cards.map((card) => (
        <CardDisplay
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          selected={selectedCardIds.includes(card.id)}
        />
      ))}
    </div>
  );
};

export default CardGrid; 