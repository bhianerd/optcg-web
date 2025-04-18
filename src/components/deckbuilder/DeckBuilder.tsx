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
import { importDeck } from '../../utils/deckImporter';
import { groupCards } from '../../utils/deckUtils';
import CardFilters from '../CardFilters';
import CardGrid from '../CardGrid';
import StackedCardDisplay from '../StackedCardDisplay';

const DeckBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const {
    filteredCards,
    selectedDeck,
    allCards,
    isLoading,
    error
  } = useSelector((state: RootState) => state.deckBuilder);

  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

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

  const handleImportDeck = async () => {
    setImportError(null);
    
    try {
      const result = await importDeck(importText, allCards);
      
      if (!result.success) {
        setImportError(result.error || 'Failed to import deck');
        return;
      }
      
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        name: 'Imported Deck',
        leader: result.leader || null as any,
        cards: result.cards,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch(setSelectedDeck(newDeck));
      setImportModalOpen(false);
      setImportText('');
    } catch (error) {
      setImportError('Failed to import deck');
    }
  };

  const handleCardClick = (card: Card) => {
    if (!selectedDeck) {
      handleCreateDeck();
      return;
    }

    if (card.type.toLowerCase() === 'leader') {
      dispatch(setLeader(card));
    } else {
      // Count how many of this card are already in the deck
      const cardCount = selectedDeck.cards.filter(c => c.id === card.id).length;
      
      if (cardCount < 4 && selectedDeck.cards.length < 50) {
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
      {/* Create/Save/Import Deck buttons */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
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
            <button
              onClick={() => setImportModalOpen(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Import Deck
            </button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Import Deck</h2>
            <p className="text-sm text-gray-600 mb-4">
              Paste your deck formula below (e.g., "4xOP01-001" format, one card per line)
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-64 p-2 border rounded-lg mb-4 font-mono"
              placeholder="1xOP01-001&#13;4xOP02-015&#13;4xOP01-016"
            />
            {importError && (
              <p className="text-red-500 mb-4">{importError}</p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleImportDeck}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area - Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left column - Card Preview */}
        <div className="md:col-span-2 space-y-4">
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
        <div className="md:col-span-5">
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
              <div className="grid grid-cols-4 gap-4">
                {groupCards(selectedDeck.cards).map(({ card, count }) => (
                  <StackedCardDisplay
                    key={card.id}
                    card={card}
                    count={count}
                    onClick={() => dispatch(removeCard(card.id))}
                    onHover={setHoveredCard}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Filters and Card Grid */}
        <div className="md:col-span-5 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow">
            <CardFilters />
          </div>

          {/* Available Cards */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Available Cards</h2>
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
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
    </div>
  );
};

export default DeckBuilder;
