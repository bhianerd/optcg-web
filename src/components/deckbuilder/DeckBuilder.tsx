import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addCard,
    removeCard,
    saveDeck,
    setDeckName,
    setLeader,
    setSelectedDeck
} from '../../redux/slices/deckBuilderSlice';
import type { RootState } from '../../redux/store';
import type { Card, Deck } from '../../types/types';
import CardFilters from '../CardFilters';
import CardGrid from '../CardGrid';

const DeckBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const {
    filteredCards,
    selectedDeck,
    isLoading,
    error
  } = useSelector((state: RootState) => state.deckBuilder);

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name: 'New Deck',
      leader: null as any, // Will be set when a leader is selected
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch(setSelectedDeck(newDeck));
  };

  const handleCardClick = (card: Card) => {
    if (!selectedDeck) {
      handleCreateDeck();
      return;
    }

    if (card.type.toLowerCase() === 'leader') {
      dispatch(setLeader(card));
    } else {
      // Check if we can add more cards
      if (selectedDeck.cards.length < 50) {
        dispatch(addCard(card));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading cards: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Filters sidebar */}
      <div className="md:col-span-1">
        <CardFilters />
      </div>

      {/* Card grid and deck section */}
      <div className="md:col-span-3 space-y-4">
        {/* Create/Save Deck buttons */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            {selectedDeck ? (
              <>
                <input
                  type="text"
                  value={selectedDeck.name}
                  onChange={(e) => dispatch(setDeckName(e.target.value))}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Deck Name"
                />
                <button
                  onClick={() => dispatch(saveDeck(selectedDeck))}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Deck
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateDeck}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Create New Deck
              </button>
            )}
          </div>
        </div>

        {/* Available Cards */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Available Cards</h2>
          <CardGrid
            cards={filteredCards}
            onCardClick={handleCardClick}
            selectedCardIds={selectedDeck?.cards.map(card => card.id) || []}
          />
        </div>

        {/* Selected deck preview */}
        {selectedDeck && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">
              Current Deck: {selectedDeck.name} ({selectedDeck.cards.length}/50)
            </h2>
            {selectedDeck.leader && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Leader</h3>
                <CardGrid cards={[selectedDeck.leader]} onCardClick={() => {}} />
              </div>
            )}
            <h3 className="font-semibold mb-2">Cards</h3>
            <CardGrid
              cards={selectedDeck.cards}
              onCardClick={(card) => dispatch(removeCard(card.id))}
              selectedCardIds={[]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckBuilder;
