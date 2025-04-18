import type React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteDeck, loadDeck } from '../../redux/slices/deckBuilderSlice';
import type { Deck } from '../../types/types';

const DeckList: React.FC = () => {
  const dispatch = useAppDispatch();
  const savedDecks = useAppSelector((state) => state.deckBuilder.savedDecks);
  const selectedDeck = useAppSelector((state) => state.deckBuilder.selectedDeck);

  const handleLoadDeck = (deckId: string) => {
    dispatch(loadDeck(deckId));
  };

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      dispatch(deleteDeck(deckId));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Saved Decks</h2>
      
      {savedDecks.length === 0 ? (
        <p className="text-gray-500">No saved decks yet. Create a new deck to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedDecks.map((deck: Deck) => (
            <div
              key={deck.id}
              className={`bg-white rounded-lg shadow p-4 ${
                selectedDeck?.id === deck.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{deck.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoadDeck(deck.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Cards: {deck.cards.length}</p>
                <p>Leader: {deck.leader ? 'Selected' : 'Not selected'}</p>
                <p>Last updated: {new Date(deck.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeckList; 