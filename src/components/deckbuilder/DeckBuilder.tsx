import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    addCardToDeck,
    createNewDeck,
    resetFilters,
    saveDeck,
    setSearchTerm,
    toggleColorFilter,
    toggleCostFilter,
    toggleTypeFilter
} from '../../redux/slices/deckBuilderSlice';
import { CardColor, CardType } from '../../types/types';

const DeckBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    filteredCards,
    searchTerm,
    filters,
    selectedDeck,
  } = useAppSelector((state) => state.deckBuilder);

  const [deckName, setDeckName] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCreateDeck = () => {
    if (deckName.trim()) {
      dispatch(createNewDeck(deckName));
      setDeckName('');
    }
  };

  const handleSaveDeck = () => {
    if (selectedDeck) {
      dispatch(saveDeck());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="flex gap-4">
          {/* Left Panel - Card Preview */}
          <div className="w-1/4">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              {selectedCard ? (
                <div className="aspect-[3/4] bg-gray-700 rounded-lg">
                  {/* Card preview image will go here */}
                </div>
              ) : (
                <div className="aspect-[3/4] bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Select a card to preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Deck View */}
          <div className="w-2/4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={selectedDeck?.name || deckName}
                  onChange={(e) => selectedDeck ? dispatch(setDeckName(e.target.value)) : setDeckName(e.target.value)}
                  placeholder="Deck Name..."
                  className="bg-gray-700 text-white px-3 py-2 rounded"
                />
                <div className="space-x-2">
                  {!selectedDeck ? (
                    <button
                      onClick={handleCreateDeck}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Create Deck
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveDeck}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save Deck
                    </button>
                  )}
                </div>
              </div>

              {/* Main Deck */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Main Deck</h3>
                <div className="grid grid-cols-8 gap-1 bg-gray-700 p-2 rounded min-h-[200px]">
                  {selectedDeck?.cards.map((cardId) => (
                    <div
                      key={cardId}
                      className="aspect-[3/4] bg-gray-600 rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                      onClick={() => setSelectedCard(cardId)}
                    >
                      {/* Card image will go here */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Deck */}
              <div>
                <h3 className="text-xl font-bold mb-2">Extra Deck</h3>
                <div className="grid grid-cols-8 gap-1 bg-gray-700 p-2 rounded min-h-[100px]">
                  {/* Extra deck cards will go here */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Search and Filters */}
          <div className="w-1/4">
            <div className="bg-gray-800 rounded-lg p-4">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full p-2 bg-gray-700 text-white rounded mb-4"
              />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(CardColor).map((color) => (
                      <button
                        key={color}
                        onClick={() => dispatch(toggleColorFilter(color))}
                        className={`px-3 py-1 rounded ${
                          filters.colors.includes(color)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(CardType).map((type) => (
                      <button
                        key={type}
                        onClick={() => dispatch(toggleTypeFilter(type))}
                        className={`px-3 py-1 rounded ${
                          filters.types.includes(type)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Cost</h3>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cost) => (
                      <button
                        key={cost}
                        onClick={() => dispatch(toggleCostFilter(cost))}
                        className={`px-3 py-1 rounded ${
                          filters.costs.includes(cost)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700'
                        }`}
                      >
                        {cost}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => dispatch(resetFilters())}
                className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reset Filters
              </button>

              {/* Search Results */}
              <div className="mt-4">
                <h3 className="font-bold mb-2">Search Results</h3>
                <div className="grid grid-cols-3 gap-1">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="aspect-[3/4] bg-gray-700 rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                      onClick={() => {
                        setSelectedCard(card.id);
                        if (selectedDeck) {
                          dispatch(addCardToDeck(card.id));
                        }
                      }}
                    >
                      {/* Card image will go here */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
