import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCard,
  decrementCard,
  deleteDeck,
  removeCard,
  saveDeck,
  setLeader,
  setSelectedDeck
} from '../../redux/slices/deckBuilderSlice';
import type { RootState } from '../../redux/store';
import type { Card, Deck } from '../../types/types';
import { importDeck } from '../../utils/deckImporter';
import { exportDeckToFormula, groupCards } from '../../utils/deckUtils';
import CardFilters from '../CardFilters';
import CardGrid from '../CardGrid';
import StackedCardDisplay from '../StackedCardDisplay';
import { Button } from '../ui/Button';
import { DeckToolbar } from './DeckToolbar';

const DeckBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const {
    filteredCards,
    selectedDeck,
    allCards,
    savedDecks,
    isLoading,
    error
  } = useSelector((state: RootState) => state.deckBuilder);

  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showSavedDecks, setShowSavedDecks] = useState(false);

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
    dispatch(saveDeck(newDeck));
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
      dispatch(saveDeck(newDeck));
      setImportModalOpen(false);
      setImportText('');
    } catch (error) {
      setImportError('Failed to import deck');
    }
  };

  const handleExportDeck = () => {
    if (!selectedDeck) return;
    setExportModalOpen(true);
  };

  const handleCopyToClipboard = async () => {
    if (!selectedDeck) return;
    
    const formula = exportDeckToFormula(selectedDeck.leader, selectedDeck.cards);
    
    try {
      await navigator.clipboard.writeText(formula);
      // Close the modal after a short delay to show success
      setTimeout(() => setExportModalOpen(false), 500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
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
      // Get the base card ID (without promo suffixes)
      const baseCardId = card.id.split('_')[0];
      
      // Count how many cards with the same base ID are already in the deck
      const cardCount = selectedDeck.cards.filter(c => {
        const cBaseId = c.id.split('_')[0];
        return cBaseId === baseCardId;
      }).length;
      
      if (cardCount < 4 && selectedDeck.cards.length < 50) {
        dispatch(addCard(card));
      }
    }
  };

  const handleCardRightClick = (card: Card) => {
    if (!selectedDeck) return;

    if (card.type.toLowerCase() === 'leader') {
      // Don't allow removing leader via right-click
      return;
    }

    // Get the base card ID (without promo suffixes)
    const baseCardId = card.id.split('_')[0];
    
    // Find the first card with the same base ID in the deck
    const cardToRemove = selectedDeck.cards.find(c => {
      const cBaseId = c.id.split('_')[0];
      return cBaseId === baseCardId;
    });
    
    if (cardToRemove) {
      dispatch(decrementCard(cardToRemove.id));
    }
  };

  const handleLoadDeck = (deck: Deck) => {
    dispatch(setSelectedDeck(deck));
    setShowSavedDecks(false);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      dispatch(deleteDeck(deckId));
    }
  };

  const handleSaveAs = () => {
    if (!selectedDeck) return;
    
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name: `${selectedDeck.name} (Copy)`,
      leader: selectedDeck.leader,
      cards: [...selectedDeck.cards],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    dispatch(setSelectedDeck(newDeck));
    dispatch(saveDeck(newDeck));
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
      {/* Deck Toolbar */}
      <DeckToolbar
        selectedDeck={selectedDeck}
        showSavedDecks={showSavedDecks}
        onCreateDeck={handleCreateDeck}
        onSaveAs={handleSaveAs}
        onExport={handleExportDeck}
        onImport={() => setImportModalOpen(true)}
        onToggleSavedDecks={() => setShowSavedDecks(!showSavedDecks)}
      />

      {/* Saved Decks Modal */}
      {showSavedDecks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Saved Decks</h2>
            {savedDecks.length === 0 ? (
              <p className="text-gray-500">No saved decks found.</p>
            ) : (
              <div className="space-y-4">
                {savedDecks.map(deck => (
                  <div key={deck.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{deck.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLoadDeck(deck)}
                          variant="blue"
                          className="px-3 py-1 text-sm"
                        >
                          Load
                        </Button>
                        <Button
                          onClick={() => handleDeleteDeck(deck.id)}
                          variant="red"
                          className="px-3 py-1 text-sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Cards: {deck.cards.length}/50</p>
                      <p>Leader: {deck.leader?.name || 'None'}</p>
                      <p>Last Updated: {new Date(deck.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowSavedDecks(false)}
                variant="gray"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              <Button
                onClick={() => setImportModalOpen(false)}
                variant="gray"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportDeck}
                variant="blue"
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportModalOpen && selectedDeck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Export Deck</h2>
            <p className="text-sm text-gray-600 mb-4">
              Here's your deck formula. Click the button below to copy it to your clipboard.
            </p>
            <pre className="w-full h-64 p-2 border rounded-lg mb-4 font-mono overflow-auto bg-gray-50">
              {exportDeckToFormula(selectedDeck.leader, selectedDeck.cards)}
            </pre>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setExportModalOpen(false)}
                variant="gray"
              >
                Close
              </Button>
              <Button
                onClick={handleCopyToClipboard}
                variant="blue"
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area - Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative">
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
                    onCardRightClick={() => {}} 
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
                    onRightClick={() => dispatch(decrementCard(card.id))}
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
                onCardRightClick={handleCardRightClick}
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
