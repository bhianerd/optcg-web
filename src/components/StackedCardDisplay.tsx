import React from 'react';
import type { Card } from '../types/types';
import CardDisplay from './CardDisplay';

type StackedCardDisplayProps = {
  card: Card;
  count: number;
  onClick?: () => void;
  onRightClick?: () => void;
  onHover?: (card: Card | null) => void;
  selected?: boolean;
};

const StackedCardDisplay: React.FC<StackedCardDisplayProps> = ({
  card,
  count,
  onClick,
  onRightClick,
  onHover,
  selected
}) => {
  return (
    <div 
      className="relative"
      onMouseEnter={() => onHover?.(card)}
    >
      <CardDisplay
        card={card}
        onClick={onClick}
        onRightClick={onRightClick}
        selected={selected}
      />
      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
        {count}
      </div>
    </div>
  );
};

export default StackedCardDisplay; 