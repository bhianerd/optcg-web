import { useState } from 'react';
import { cardsData } from '../data/card';
import { CardColor, CardType } from '../types/types';

export default function CardList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<CardColor | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<CardType | 'ALL'>('ALL');

  const filteredCards = cardsData.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.effect.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = selectedColor === 'ALL' || card.color === selectedColor;
    const matchesType = selectedType === 'ALL' || card.type === selectedType;
    
    return matchesSearch && matchesColor && matchesType;
  });

  return (
    <div className="p-4">
      <div className="mb-4 space-y-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cards..."
          className="w-full p-2 border rounded"
        />
        
        <div className="flex gap-2">
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value as CardColor | 'ALL')}
            className="p-2 border rounded"
          >
            <option value="ALL">All Colors</option>
            {Object.values(CardColor).map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CardType | 'ALL')}
            className="p-2 border rounded"
          >
            <option value="ALL">All Types</option>
            {Object.values(CardType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCards.map((card) => (
          <div key={card.id} className="border rounded p-2">
            <img src={card.img_url} alt={card.name} className="w-full" />
            <div className="mt-2">
              <h3 className="font-bold">{card.name}</h3>
              <p className="text-sm">Type: {card.type}</p>
              <p className="text-sm">Color: {card.color}</p>
              {card.power && <p className="text-sm">Power: {card.power}</p>}
              <p className="text-sm">Cost: {card.cost}</p>
              <p className="text-sm mt-1">{card.effect}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 