import type { Card } from '../types/types';

type CardDisplayProps = {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
};

export default function CardDisplay({ card, onClick, selected = false }: CardDisplayProps) {
  return (
    <div
      className={`relative cursor-pointer transition-transform hover:scale-105 ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="aspect-[2.5/3.5] w-full overflow-hidden rounded-lg">
        {card.img_url ? (
          <img
            src={card.img_url}
            alt={card.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to a placeholder image if the card image fails to load
              (e.target as HTMLImageElement).src = '/placeholder-card.png';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-sm">
        <div className="font-medium">{card.name}</div>
        <div className="text-gray-500">
          {typeof card.cost === 'number' && `Cost: ${String(card.cost)} `}
          {typeof card.power === 'number' && `Power: ${String(card.power)}`}
        </div>
      </div>
    </div>
  );
} 