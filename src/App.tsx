import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DeckEditor from './components/deck/DeckEditor';
import TestGame from './components/game/TestGame';
import MenuPage from './components/menu/MenuPage';
import { CardColor, CardType, type Card, type Deck } from './types/types';

// Type for a potential deck object from storage
type StoredDeck = {
  id: string;
  name: string;
  leader: Card;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
};

// Type guard for saved deck
function isStoredDeck(deck: unknown): deck is StoredDeck {
  if (typeof deck !== 'object' || deck === null) return false;
  
  const d = deck as Record<string, unknown>;
  return (
    typeof d.id === 'string' &&
    typeof d.name === 'string' &&
    typeof d.leader === 'object' && d.leader !== null &&
    Array.isArray(d.cards) &&
    typeof d.createdAt === 'string' &&
    typeof d.updatedAt === 'string'
  );
}

function App() {
  // Get saved decks from localStorage and parse with type safety
  const savedDecksJson = localStorage.getItem('optcg_saved_decks');
  let savedDecks: Deck[] = [];
  
  try {
    if (savedDecksJson) {
      const parsed: unknown = JSON.parse(savedDecksJson);
      if (Array.isArray(parsed) && parsed.every(isStoredDeck)) {
        savedDecks = parsed.map(deck => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
          updatedAt: new Date(deck.updatedAt)
        }));
      }
    }
  } catch (error) {
    console.error('Error parsing saved decks:', error);
  }

  // Create a test card
  const testCard: Card = {
    id: 'OP01-002',
    name: 'Straw Hat Crew',
    color: CardColor.RED,
    type: CardType.CHARACTER,
    cost: 2,
    power: 4000,
    counter: 2000,
    attribute: 'Straw Hat Crew',
    effect: 'When this character attacks, draw 1 card.',
    trigger: '',
    life: undefined,
    rarity: 'common',
    set_id: 'OP01',
    card_number: '002',
    img_url: '/data/en/images/OP01-002.png',
  };

  // Use the first deck as both player and opponent deck for testing
  const testDeck: Deck = savedDecks[0] ?? {
    id: 'test-deck-1',
    name: 'Test Deck',
    leader: {
      id: 'OP01-001',
      name: 'Monkey D. Luffy',
      color: CardColor.RED,
      type: CardType.LEADER,
      cost: 0,
      power: 5000,
      counter: 2000,
      attribute: 'Straw Hat Crew',
      effect: 'This Leader cannot be KO\'d by effects.',
      trigger: '',
      life: undefined,
      rarity: 'super_rare',
      set_id: 'OP01',
      card_number: '001',
      img_url: '/data/en/images/OP01-001.png',
    },
    cards: new Array(50).fill(testCard) as Card[],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <Router>
      <Routes>
        {/* Redirect root to menu */}
        <Route path="/" element={<Navigate to="/menu" replace />} />
        
        {/* Main menu */}
        <Route path="/menu" element={<MenuPage />} />
        
        {/* Deck editor */}
        <Route path="/deck-editor" element={<DeckEditor />} />
        
        {/* Game board */}
        <Route path="/game" element={<TestGame />} />
      </Routes>
    </Router>
  );
}

export default App;
