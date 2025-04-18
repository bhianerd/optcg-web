import React, { useState } from 'react';
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

  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name: 'New Deck',
      leader: null as any,
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
    <div className="container mx-auto p-4 space-y-4">
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

      {/* Main content area - Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left column - Card Preview */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Card Preview</h2>
            {hoveredCard ? (
              <div className="space-y-4">
                <div className="aspect-[63/88] bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={hoveredCard.img_url} 
                    alt={hoveredCard.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{hoveredCard.name}</h3>
                  <p className="text-sm">Type: {hoveredCard.type}</p>
                  <p className="text-sm">Color: {hoveredCard.color}</p>
                  <p className="text-sm">Cost: {hoveredCard.cost}</p>
                  {hoveredCard.power && <p className="text-sm">Power: {hoveredCard.power}</p>}
                  {hoveredCard.counter && <p className="text-sm">Counter: {hoveredCard.counter}</p>}
                  <p className="text-sm whitespace-pre-wrap">{hoveredCard.effect}</p>
                  {hoveredCard.trigger && (
                    <p className="text-sm">
                      <span className="font-bold">Trigger:</span> {hoveredCard.trigger}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Hover over a card to see details
              </div>
            )}
          </div>
        </div>

        {/* Middle column - Deck Preview */}
        <div className="md:col-span-3">
          {selectedDeck && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">
                Current Deck: {selectedDeck.name} ({selectedDeck.cards.length}/50)
              </h2>
              {selectedDeck.leader && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Leader</h3>
                  <CardGrid 
                    cards={[selectedDeck.leader]} 
                    onCardClick={() => {}} 
                    onCardHover={setHoveredCard}
                  />
                </div>
              )}
              <h3 className="font-semibold mb-2">Cards</h3>
              <CardGrid
                cards={selectedDeck.cards}
                onCardClick={(card) => dispatch(removeCard(card.id))}
                onCardHover={setHoveredCard}
                selectedCardIds={[]}
              />
            </div>
          )}
        </div>

        {/* Right column - Filters and Card Grid */}
        <div className="md:col-span-6 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow">
            <CardFilters />
          </div>

          {/* Available Cards */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Available Cards</h2>
            <CardGrid
              cards={filteredCards}
              onCardClick={handleCardClick}
              onCardHover={setHoveredCard}
              selectedCardIds={selectedDeck?.cards.map(card => card.id) || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
