import type { Card } from '../types/types';
import CardDisplay from './CardDisplay';

type CardGridProps = {
  cards: Card[];
  onCardClick: (card: Card) => void;
  onCardHover?: (card: Card | null) => void;
  selectedCardIds?: string[];
};

export default function CardGrid({ 
  cards, 
  onCardClick, 
  onCardHover,
  selectedCardIds = [] 
}: CardGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="flex justify-center"
          onMouseEnter={() => { onCardHover?.(card); }}
        >
          <CardDisplay
            card={card}
            onClick={() => onCardClick(card)}
            selected={selectedCardIds.includes(card.id)}
          />
        </div>
      ))}
    </div>
  );
} 