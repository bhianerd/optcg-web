// src/redux/slices/deckBuilderSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
// import { SupabaseDeckService } from '../../services/supabaseDeckService';
import type { Card, CardColor, CardType, Deck } from '../../types/types';

// Local storage key for saved decks (fallback)
const SAVED_DECKS_KEY = 'optcg_saved_decks';

// Async thunks for Supabase operations - Temporarily disabled
/*
export const loadDecks = createAsyncThunk(
  'deckBuilder/loadDecks',
  async () => {
    try {
      return await SupabaseDeckService.getDecks();
    } catch (error) {
      console.error('Failed to load decks from Supabase, falling back to localStorage:', error);
      return loadSavedDecks();
    }
  }
);

export const saveDeckAsync = createAsyncThunk(
  'deckBuilder/saveDeckAsync',
  async (deck: Deck) => {
    try {
      const savedDeck = await SupabaseDeckService.saveDeck(deck);
      if (!savedDeck) {
        throw new Error('Failed to save deck to Supabase');
      }
      return savedDeck;
    } catch (error) {
      console.error('Failed to save deck to Supabase, falling back to localStorage:', error);
      // Fallback to localStorage
      const savedDecks = loadSavedDecks();
      const deckToSave = {
        ...deck,
        updatedAt: new Date()
      };

      const existingIndex = savedDecks.findIndex(d => d.id === deckToSave.id);
      if (existingIndex >= 0) {
        savedDecks[existingIndex] = deckToSave;
      } else {
        savedDecks.push(deckToSave);
      }

      saveDecksToStorage(savedDecks);
      return deckToSave;
    }
  }
);

export const deleteDeckAsync = createAsyncThunk(
  'deckBuilder/deleteDeckAsync',
  async (deckId: string) => {
    try {
      const success = await SupabaseDeckService.deleteDeck(deckId);
      if (!success) {
        throw new Error('Failed to delete deck from Supabase');
      }
      return deckId;
    } catch (error) {
      console.error('Failed to delete deck from Supabase, falling back to localStorage:', error);
      // Fallback to localStorage
      const savedDecks = loadSavedDecks();
      const filteredDecks = savedDecks.filter(d => d.id !== deckId);
      saveDecksToStorage(filteredDecks);
      return deckId;
    }
  }
);
*/

// Type guard to check if an object is a Deck
const isDeck = (obj: unknown): obj is Deck => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const deck = obj as Record<string, unknown>;
  return (
    typeof deck.id === 'string' &&
    typeof deck.name === 'string' &&
    Array.isArray(deck.cards) &&
    typeof deck.createdAt === 'string' &&
    typeof deck.updatedAt === 'string'
  );
};

// Load saved decks from local storage
const loadSavedDecks = (): Deck[] => {
  try {
    const savedDecks = localStorage.getItem(SAVED_DECKS_KEY);
    if (!savedDecks) return [];
    
    const parsedDecks = JSON.parse(savedDecks) as unknown;
    // Validate that the parsed data is an array of decks
    if (!Array.isArray(parsedDecks)) return [];
    
    // Filter out any invalid deck objects and convert string dates to Date objects
    return parsedDecks.filter(isDeck).map(deck => ({
      ...deck,
      createdAt: new Date(deck.createdAt),
      updatedAt: new Date(deck.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading saved decks:', error);
    return [];
  }
};

// Save decks to local storage
const saveDecksToStorage = (decks: Deck[]) => {
  try {
    // Convert Date objects to ISO strings for storage
    const decksToStore = decks.map(deck => ({
      ...deck,
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString()
    }));
    localStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(decksToStore));
  } catch (error) {
    console.error('Error saving decks:', error);
  }
};

type Filters = {
  colors: CardColor[];
  types: CardType[];
  costs: number[];
  minPower?: number;
  maxPower?: number;
};

type DeckBuilderState = {
  allCards: Card[];
  filteredCards: Card[];
  selectedDeck: Deck | null;
  savedDecks: Deck[];
  searchTerm: string;
  filters: Filters;
  isLoading: boolean;
  error: string | null;
};

const initialState: DeckBuilderState = {
  allCards: [],
  filteredCards: [],
  selectedDeck: null,
  savedDecks: loadSavedDecks(),
  searchTerm: '',
  filters: {
    colors: [],
    types: [],
    costs: [],
  },
  isLoading: false,
  error: null,
};

// Helper function to filter cards based on current filters and search term
const applyFilters = (cards: Card[], state: DeckBuilderState): Card[] => {
  console.log('Applying filters:', { 
    filters: state.filters, 
    searchTerm: state.searchTerm,
    totalCards: cards.length 
  });

  // Temporary logging to debug card data
  console.log('First 5 cards:', cards.slice(0, 5).map(card => ({
    name: card.name,
    color: card.color,
    type: card.type
  })));
  
  return cards.filter(card => {
    // Search term filter
    if (state.searchTerm) {
      const searchTerms = state.searchTerm.toLowerCase().split(' ').filter(Boolean);
      const cardText = `${card.name} ${card.effect} ${card.type} ${card.color}`.toLowerCase();
      console.log('Card text:', cardText);
      const matchesSearch = searchTerms.some(term => cardText.includes(term));
      if (!matchesSearch) {
        console.log('Card filtered by search:', card.name);
        return false;
      }
    }

    // Color filter
    if (state.filters.colors.length > 0) {
      const cardColor = card.color.toLowerCase();
      const selectedColors = state.filters.colors.map(c => c.toLowerCase());
      
      console.log('Color check:', {
        cardName: card.name,
        cardColor,
        selectedColors,
        matches: selectedColors.includes(cardColor)
      });
      
      if (!selectedColors.includes(cardColor)) {
        console.log('Card filtered by color:', { 
          name: card.name, 
          cardColor, 
          selectedColors 
        });
        return false;
      }
    }

    // Type filter
    if (state.filters.types.length > 0) {
      const cardType = card.type.toLowerCase();
      const matchesType = state.filters.types.some(type => 
        type.toLowerCase() === cardType
      );
      if (!matchesType) {
        console.log('Card filtered by type:', card.name, 'Type:', card.type);
        return false;
      }
    }

    // Cost filter
    if (state.filters.costs.length > 0 && !state.filters.costs.includes(card.cost)) {
      console.log('Card filtered by cost:', card.name, 'Cost:', card.cost);
      return false;
    }

    // Power range filter
    if (typeof card.power === 'number') {
      if (state.filters.minPower !== undefined && card.power < state.filters.minPower) {
        console.log('Card filtered by min power:', card.name, 'Power:', card.power);
        return false;
      }
      if (state.filters.maxPower !== undefined && card.power > state.filters.maxPower) {
        console.log('Card filtered by max power:', card.name, 'Power:', card.power);
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
    setAllCards: (state, action: PayloadAction<Card[]>) => {
      state.allCards = action.payload;
      state.filteredCards = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredCards = applyFilters(state.allCards, state);
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
      };
      state.filteredCards = state.allCards;
    },
    setSelectedDeck: (state, action: PayloadAction<Deck | null>) => {
      state.selectedDeck = action.payload;
    },
    addCard: (state, action: PayloadAction<Card>) => {
      if (state.selectedDeck && state.selectedDeck.cards.length < 50) {
        state.selectedDeck.cards.push(action.payload);
      }
    },
    removeCard: (state, action: PayloadAction<string>) => {
      if (state.selectedDeck) {
        state.selectedDeck.cards = state.selectedDeck.cards.filter(
          card => card.id !== action.payload
        );
      }
    },
    decrementCard: (state, action: PayloadAction<string>) => {
      if (state.selectedDeck) {
        const cardId = action.payload;
        const cardIndex = state.selectedDeck.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          state.selectedDeck.cards.splice(cardIndex, 1);
        }
      }
    },
    setLeader: (state, action: PayloadAction<Card>) => {
      if (state.selectedDeck) {
        state.selectedDeck.leader = action.payload;
      }
    },
    setDeckName: (state, action: PayloadAction<string>) => {
      if (state.selectedDeck) {
        state.selectedDeck.name = action.payload;
      }
    },
    saveDeck: (state, action: PayloadAction<Deck>) => {
      const deckToSave = {
        ...action.payload,
        updatedAt: new Date()
      };
      
      const existingIndex = state.savedDecks.findIndex(deck => deck.id === deckToSave.id);
      if (existingIndex >= 0) {
        state.savedDecks[existingIndex] = deckToSave;
      } else {
        state.savedDecks.push(deckToSave);
      }
      
      // Save to local storage after updating state
      saveDecksToStorage(state.savedDecks);
      
      // If this is the currently selected deck, update it too
      if (state.selectedDeck?.id === deckToSave.id) {
        state.selectedDeck = deckToSave;
      }
    },
    deleteDeck: (state, action: PayloadAction<string>) => {
      state.savedDecks = state.savedDecks.filter(deck => deck.id !== action.payload);
      if (state.selectedDeck?.id === action.payload) {
        state.selectedDeck = null;
      }
      // Save to local storage after updating state
      saveDecksToStorage(state.savedDecks);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addCardToDeck: (state, action: PayloadAction<Card>) => {
      if (state.selectedDeck && state.selectedDeck.cards.length < 50) {
        state.selectedDeck.cards.push(action.payload);
      }
    },
    loadDeck: (state, action: PayloadAction<string>) => {
      const deck = state.savedDecks.find(d => d.id === action.payload);
      if (deck) {
        state.selectedDeck = deck;
      }
    },
  },
  // extraReducers temporarily disabled for Supabase integration
  /*
  extraReducers: (builder) => {
    // Load decks
    builder
      .addCase(loadDecks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDecks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedDecks = action.payload as Deck[];
      })
      .addCase(loadDecks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load decks';
      });

    // Save deck async
    builder
      .addCase(saveDeckAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveDeckAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const savedDeck = action.payload as Deck;
        
        const existingIndex = state.savedDecks.findIndex(deck => deck.id === savedDeck.id);
        if (existingIndex >= 0) {
          state.savedDecks[existingIndex] = savedDeck;
        } else {
          state.savedDecks.push(savedDeck);
        }
        
        // Update selected deck if it's the same
        if (state.selectedDeck?.id === savedDeck.id) {
          state.selectedDeck = savedDeck;
        }
      })
      .addCase(saveDeckAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save deck';
      });

    // Delete deck async
    builder
      .addCase(deleteDeckAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDeckAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const deckId = action.payload as string;
        state.savedDecks = state.savedDecks.filter(deck => deck.id !== deckId);
        
        if (state.selectedDeck?.id === deckId) {
          state.selectedDeck = null;
        }
      })
      .addCase(deleteDeckAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete deck';
      });
  },
  */
});

export const {
  setAllCards,
  setSearchTerm,
  toggleColorFilter,
  toggleTypeFilter,
  toggleCostFilter,
  setPowerRange,
  resetFilters,
  setSelectedDeck,
  addCard,
  addCardToDeck,
  removeCard,
  decrementCard,
  setLeader,
  setDeckName,
  saveDeck,
  loadDeck,
  deleteDeck,
  setLoading,
  setError,
} = deckBuilderSlice.actions;

export default deckBuilderSlice.reducer;
  