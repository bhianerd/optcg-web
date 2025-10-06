import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetFilters,
    setPowerRange,
    setSearchTerm,
    toggleColorFilter,
    toggleCostFilter,
    toggleTypeFilter,
} from '../redux/slices/deckBuilderSlice';
import { RootState } from '../redux/store';
import { CardColor, CardType } from '../types/types';

export default function CardFilters() {
  const dispatch = useDispatch();
  const { filters, allCards } = useSelector((state: RootState) => state.deckBuilder);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Starting search with term:', localSearchTerm);
    console.log('Total cards available:', allCards.length);
    console.log('Sample cards:', allCards.slice(0, 2));

    const searchTerms = localSearchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    console.log('Search terms:', searchTerms);

    // Find matching cards using flexible search
    const matchingCards = allCards.filter(card => {
      // If no search terms, show all cards
      if (searchTerms.length === 0) return true;

      const cardName = card.name?.toLowerCase() || '';
      const cardEffect = card.effect?.toLowerCase() || '';
      const cardType = card.type?.toLowerCase() || '';
      const cardColor = card.color?.toLowerCase() || '';
      const searchText = `${cardName} ${cardEffect} ${cardType} ${cardColor}`;

      console.log('Card being checked:', {
        id: card.id,
        name: cardName,
        searchText: searchText
      });

      // Card matches if it contains any of the search terms
      const matches = searchTerms.some(term => searchText.includes(term));
      if (matches) {
        console.log('Match found for card:', card.name);
      }
      return matches;
    });

    console.log('Search Results:', {
      searchTerms,
      totalCards: allCards.length,
      matches: matchingCards.length,
      matchingCards: matchingCards.map(card => ({
        id: card.id,
        name: card.name,
        type: card.type,
        color: card.color
      }))
    });

    // Update the filtered cards in the store
    dispatch(setSearchTerm(localSearchTerm));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const colors = Object.values(CardColor);
  const types = Object.values(CardType);
  const costs = Array.from({ length: 11 }, (_, i) => i); // 0-10 cost

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      {/* Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search by name, effect, type, or color..."
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Tip: You can search for multiple terms (e.g., "red luffy" or "draw power")
        </p>
      </div>

      {/* Color Filters */}
      <div>
        <h3 className="font-semibold mb-2">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => dispatch(toggleColorFilter(color))}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.colors.includes(color)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="font-semibold mb-2">Types</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => dispatch(toggleTypeFilter(type))}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.types.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Filters */}
      <div>
        <h3 className="font-semibold mb-2">Cost</h3>
        <div className="flex flex-wrap gap-2">
          {costs.map((cost) => (
            <button
              key={cost}
              onClick={() => dispatch(toggleCostFilter(cost))}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                filters.costs.includes(cost)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cost}
            </button>
          ))}
        </div>
      </div>

      {/* Power Range */}
      <div>
        <h3 className="font-semibold mb-2">Power Range</h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPower || ''}
            onChange={(e) =>
              dispatch(setPowerRange({ min: e.target.value ? parseInt(e.target.value) : undefined }))
            }
            className="w-24 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPower || ''}
            onChange={(e) =>
              dispatch(setPowerRange({ max: e.target.value ? parseInt(e.target.value) : undefined }))
            }
            className="w-24 p-2 border rounded"
          />
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          dispatch(resetFilters());
          setLocalSearchTerm('');
        }}
        className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
} 