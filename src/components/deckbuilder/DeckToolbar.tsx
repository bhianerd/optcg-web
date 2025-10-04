import React from 'react';
import { useDispatch } from 'react-redux';
import { saveDeck, setDeckName } from '../../redux/slices/deckBuilderSlice';
import type { Deck } from '../../types/types';
import { Button } from '../ui/Button';

interface DeckToolbarProps {
  selectedDeck: Deck | null;
  showSavedDecks: boolean;
  onCreateDeck: () => void;
  onSaveAs: () => void;
  onExport: () => void;
  onImport: () => void;
  onToggleSavedDecks: () => void;
}

export const DeckToolbar: React.FC<DeckToolbarProps> = ({
  selectedDeck,
  showSavedDecks,
  onCreateDeck,
  onSaveAs,
  onExport,
  onImport,
  onToggleSavedDecks,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center flex-wrap">
          {selectedDeck ? (
            <>
              <input
                type="text"
                value={selectedDeck.name}
                onChange={(e) => dispatch(setDeckName(e.target.value))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deck Name"
              />
              <Button 
                onClick={() => dispatch(saveDeck(selectedDeck))} 
                variant="blue"
              >
                Save Deck
              </Button>
              <Button onClick={onSaveAs} variant="purple">
                Save As New Deck
              </Button>
              <Button onClick={onExport} variant="green">
                Export Deck
              </Button>
            </>
          ) : (
            <Button onClick={onCreateDeck} variant="green">
              Create New Deck
            </Button>
          )}
          
          <Button onClick={onImport} variant="purple">
            Import Deck
          </Button>
          
          <Button onClick={onToggleSavedDecks} variant="yellow">
            {showSavedDecks ? 'Hide Saved Decks' : 'Show Saved Decks'}
          </Button>
        </div>
      </div>
    </div>
  );
};
