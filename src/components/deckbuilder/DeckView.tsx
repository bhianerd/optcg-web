import type React from 'react';
import { useAppSelector } from '../../app/hooks';
import type { Card, Deck } from '../../types/types';
import CardItem from './CardItem';

type DeckViewProps = {
  deck: Deck;
  onRemoveCard: (cardId: string, index: number) => void;
};

const DeckView: React.FC<DeckViewProps> = ({ deck, onRemoveCard }) => {
  const allCards = useAppSelector((state) => state.deckBuilder.allCards);
  
  const cardCounts = deck.cards.reduce<Record<string, number>>((acc, cardId) => {
    acc[cardId] = (acc[cardId] || 0) + 1;
    return acc;
  }, {});
  const getCardById = (id: string): Card | undefined => {
    if (!allCards) return undefined;
    return allCards.find((card: Card) => card.id === id);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">Deck Stats</h3>
        <p>Total Cards: {deck.cards.length}</p>
        <p>Unique Cards: {Object.keys(cardCounts).length}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">Leader</h3>
        {deck.leader ? (
          <div className="bg-gray-100 p-2 rounded">
            {(() => {
              const leaderCard = getCardById(deck.leader.id);
              return leaderCard ? <CardItem card={leaderCard} showAddButton={false} /> : null;
            })()}
          </div>
        ) : (
          <p className="text-gray-500">No leader selected</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">Main Deck</h3>
        <div className="space-y-2">
          {Object.entries(cardCounts).map(([cardId, count]) => {
            const card = getCardById(cardId);
            if (!card) return null;
            
            return (
              <div key={cardId} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <CardItem card={card} showAddButton={false} />
                  <span className="font-bold">x{count}</span>
                </div>
                <button
                  onClick={() => {
                    onRemoveCard(cardId, 0);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeckView;
