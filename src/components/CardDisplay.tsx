import Image from 'next/image';
import React from 'react';
import { Card } from '../types/types';

interface CardDisplayProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, onClick, selected = false }) => {
  return (
    <div 
      className={`relative rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 ${
        selected ? 'ring-4 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative w-[240px] h-[334px]">
        <Image
          src={card.img_url}
          alt={card.name}
          fill
          className="object-cover"
          sizes="(max-width: 240px) 100vw, 240px"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <p className="font-semibold truncate">{card.name}</p>
        <div className="flex justify-between text-sm">
          <span>Cost: {card.cost}</span>
          {card.power && <span>Power: {card.power}</span>}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay; 