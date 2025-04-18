import { useState } from 'react';
import { cardsData } from '../data/card';
import { Deck } from '../types/types';

export default function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([]);

  const handleDeleteDeck = (deckId: string) => {
    setDecks(decks.filter(deck => deck.id !== deckId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Decks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <div key={deck.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{deck.name}</h2>
              <button
                onClick={() => handleDeleteDeck(deck.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>

            {deck.leader && (
              <div className="mt-2">
                <h3 className="font-bold">Leader:</h3>
                <div className="flex items-center gap-2">
                  <img src={deck.leader.img_url} alt={deck.leader.name} className="w-16" />
                  <span>{deck.leader.name}</span>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-bold">Cards ({deck.cards.length}):</h3>
              <div className="grid grid-cols-4 gap-1 mt-2">
                {deck.cards.map((currentCard) => {
                  const card = cardsData.find(c => c.id === currentCard.id);
                  if (!card) return null;
                  return (
                    <img
                      key={card.id}
                      src={card.img_url}
                      alt={card.name}
                      className="w-full"
                      title={card.name}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <p>Created: {deck.createdAt.toLocaleDateString()}</p>
              <p>Updated: {deck.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {decks.length === 0 && (
        <p className="text-center text-gray-500">No decks created yet.</p>
      )}
    </div>
  );
} 