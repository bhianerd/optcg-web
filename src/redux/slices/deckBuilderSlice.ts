// src/redux/slices/deckBuilderSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { cardsData } from '../../data/card';
import type { Card, CardColor, CardType, Deck } from '../../types/types';

// Add missing type definitions
type CardRarity = 'common' | 'uncommon' | 'rare' | 'super_rare' | 'secret_rare';
type CardSet = string; // Replace with actual set types if you have specific ones

type Filters = {
  colors: CardColor[];
  types: CardType[];
  costs: number[];
  rarities: CardRarity[];
  sets: CardSet[];
  minPower?: number;
  maxPower?: number;
}

type DeckBuilderState = {
  allCards: Card[];
  filteredCards: Card[];
  searchTerm: string;
  filters: Filters;
  selectedDeck: Deck | null;
  savedDecks: Deck[];
}

const initialState: DeckBuilderState = {
  allCards: cardsData,
  filteredCards: cardsData,
  searchTerm: '',
  filters: {
    colors: [],
    types: [],
    costs: [],
    rarities: [],
    sets: [],
  },
  selectedDeck: null,
  savedDecks: [],
};


// Helper function to filter cards based on current filters and search term
const applyFilters = (cards: Card[], state: DeckBuilderState): Card[] => {
    return cards.filter(card => {
      // Apply search term
      if (state.searchTerm && !card.name.toLowerCase().includes(state.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply color filter
      if (state.filters.colors.length > 0 && !state.filters.colors.includes(card.color)) {
        return false;
      }
      
      // Apply type filter
      if (state.filters.types.length > 0 && !state.filters.types.includes(card.type)) {
        return false;
      }
      
      // Apply cost filter
      if (state.filters.costs.length > 0 && !state.filters.costs.includes(card.cost)) {
        return false;
      }
      
 
      

      
      // Apply power range filter (if applicable)
      if (card.power !== undefined) {
        if (state.filters.minPower !== undefined && card.power < state.filters.minPower) {
          return false;
        }
        if (state.filters.maxPower !== undefined && card.power > state.filters.maxPower) {
          return false;
        }
      }
      
      return true;
    });
  };
  

export const deckBuilderSlice = createSlice({
    name: 'deckBuilder',
    initialState,
    reducers: {
      setSearchTerm: (state, action: PayloadAction<string>) => {
        state.searchTerm = action.payload;
        state.filteredCards = applyFilters(state.allCards, {
          ...state,
          searchTerm: action.payload
        });
      },
      
      toggleColorFilter: (state, action: PayloadAction<CardColor>) => {
        const color = action.payload;
        const index = state.filters.colors.indexOf(color);
        
        if (index === -1) {
          state.filters.colors.push(color);
        } else {
          state.filters.colors.splice(index, 1);
        }
        
        state.filteredCards = applyFilters(state.allCards, state);
      },
      
      toggleTypeFilter: (state, action: PayloadAction<CardType>) => {
        const type = action.payload;
        const index = state.filters.types.indexOf(type);
        
        if (index === -1) {
          state.filters.types.push(type);
        } else {
          state.filters.types.splice(index, 1);
        }
        
        state.filteredCards = applyFilters(state.allCards, state);
      },
      
      toggleCostFilter: (state, action: PayloadAction<number>) => {
        const cost = action.payload;
        const index = state.filters.costs.indexOf(cost);
        
        if (index === -1) {
          state.filters.costs.push(cost);
        } else {
          state.filters.costs.splice(index, 1);
        }
        
        state.filteredCards = applyFilters(state.allCards, state);
      },
      

      toggleSetFilter: (state, action: PayloadAction<CardSet>) => {
        const set = action.payload;
        const index = state.filters.sets.indexOf(set);
        
        if (index === -1) {
          state.filters.sets.push(set);
        } else {
          state.filters.sets.splice(index, 1);
        }
        
        state.filteredCards = applyFilters(state.allCards, state);
      },
      
      setPowerRange: (state, action: PayloadAction<{ min?: number; max?: number }>) => {
        const { min, max } = action.payload;
        if (min !== undefined) state.filters.minPower = min;
        if (max !== undefined) state.filters.maxPower = max;
        
        state.filteredCards = applyFilters(state.allCards, state);
      },
      
      resetFilters: (state) => {
        state.searchTerm = '';
        state.filters = {
          colors: [],
          types: [],
          costs: [],
          rarities: [],
          sets: [],
        };
        state.filteredCards = state.allCards;
      },
      
      createNewDeck: (state, action: PayloadAction<string>) => {
        const newDeck: Deck = {
          id: crypto.randomUUID(),
          name: action.payload,
          leader: null,
          cards: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        state.selectedDeck = newDeck;
      },
      
      saveDeck: (state) => {
        if (!state.selectedDeck) return;
        
        const deckIndex = state.savedDecks.findIndex(deck => deck.id === state.selectedDeck?.id);
        
        if (deckIndex === -1) {
          // New deck
          state.savedDecks.push({
            ...state.selectedDeck,
            updatedAt: new Date()
          });
        } else {
          // Update existing deck
          state.savedDecks[deckIndex] = {
            ...state.selectedDeck,
            updatedAt: new Date()
          };
        }
      },
      
      loadDeck: (state, action: PayloadAction<string>) => {
        const deckId = action.payload;
        const deck = state.savedDecks.find(d => d.id === deckId);
        
        if (deck) {
          state.selectedDeck = { ...deck };
        }
      },
      
      deleteDeck: (state, action: PayloadAction<string>) => {
        const deckId = action.payload;
        state.savedDecks = state.savedDecks.filter(deck => deck.id !== deckId);
        
        if (state.selectedDeck && state.selectedDeck.id === deckId) {
          state.selectedDeck = null;
        }
      },
      
      setDeckName: (state, action: PayloadAction<string>) => {
        if (state.selectedDeck) {
          state.selectedDeck.name = action.payload;
        }
      },
      
      setDeckLeader: (state, action: PayloadAction<string>) => {
        if (state.selectedDeck?.leader) {
          state.selectedDeck.leader.name = action.payload;
        }
      },
      
      addCardToDeck: (state, action: PayloadAction<string>) => {
        const cardId = action.payload;
        if (!state.selectedDeck) return;
        
        // Check for deck building rules
        const card = state.allCards.find(c => c.id === cardId);
        if (!card) return;
        
        // Cannot have more than 4 copies of a card (except don cards)
        if (card.type !== 'don') {
          const cardCount = state.selectedDeck.cards.filter(card => card.id === cardId).length;
          if (cardCount >= 4) return;
        }
        
        // Leaders go in leader slot
        if (card.type === 'leader') {
            state.selectedDeck.leader = card;
        } else {
          state.selectedDeck.cards.push(card);
        }
      },
      
      removeCardFromDeck: (state, action: PayloadAction<{ cardId: string, index: number }>) => {
        const { cardId, index } = action.payload;
        
        if (!state.selectedDeck) return;
        
        if (state.selectedDeck.leader?.id === cardId) {
          state.selectedDeck.leader = null;
        } else {
          // Find the index of the specific card instance to remove
          // This is important when there are multiple copies of the same card
          let foundCount = 0;
          const indexToRemove = state.selectedDeck.cards.findIndex(card => {
            if (card.id === cardId) {
              if (foundCount === index) {
                return true;
              }
              foundCount++;
            }
            return false;
          });
          
          if (indexToRemove !== -1) {
            state.selectedDeck.cards.splice(indexToRemove, 1);
          }
        }
      },
      
    //   importDeck: (state, action: PayloadAction<string>) => {
    //     try {
    //       const importedDeck = JSON.parse(action.payload) as Deck;
    //       if (importedDeck.id && importedDeck.cards) {
    //         // Validate the imported deck
    //         const validDeck: Deck = {
    //           id: importedDeck.id,
    //           name: importedDeck.name || "Imported Deck",
    //           leader: importedDeck.leader || null,
    //           cards: importedDeck.cards || [],
    //           createdAt: new Date(),
    //           updatedAt: new Date()
    //         };
            
    //         state.selectedDeck = validDeck;
    //         state.savedDecks.push(validDeck);
    //       }
    //     } catch (error) {
    //       // Handle import error (could dispatch an error action in a real app)
    //       console.error("Failed to import deck:", error);
    //     }
    //   }
    }
  });
  
  export const {
    setSearchTerm,
    toggleColorFilter,
    toggleTypeFilter,
    toggleCostFilter,
    toggleSetFilter,
    setPowerRange,
    resetFilters,
    createNewDeck,
    saveDeck,
    loadDeck,
    deleteDeck,
    setDeckName,
    setDeckLeader,
    addCardToDeck,
    removeCardFromDeck,
    // importDeck
  } = deckBuilderSlice.actions;
  
  export default deckBuilderSlice.reducer;
  