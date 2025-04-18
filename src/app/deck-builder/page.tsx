'use client';

import DeckBuilder from '../../components/DeckBuilder';
import { Card, CardColor, CardType, Deck } from '../../types/types';

// This would typically come from an API or database
const mockCards: Card[] = [
  {
    id: '1',
    name: 'Monkey D. Luffy',
    color: CardColor.RED,
    type: CardType.LEADER,
    cost: 0,
    power: 5000,
    effect: 'When this card attacks, draw 1 card.',
    img_url: '/cards/luffy.jpg',
    rarity: 'common',
    set: 'base'
  },
  // Add more mock cards here
];

export default function DeckBuilderPage() {
  const handleSaveDeck = (deck: Deck) => {
    // Here you would typically save the deck to your backend
    console.log('Saving deck:', deck);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">One Piece TCG Deck Builder</h1>
        <DeckBuilder
          availableCards={mockCards}
          onSave={handleSaveDeck}
        />
      </div>
    </main>
  );
} 