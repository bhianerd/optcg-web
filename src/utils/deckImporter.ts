import type { Card } from '../types/types';

type DeckImportResult = {
  success: boolean;
  cards: { id: string; quantity: number }[];
  error?: string;
};

export function parseDeckFormula(formula: string): DeckImportResult {
  try {
    // Split the formula into lines and filter out empty lines
    const lines = formula.split('\n').filter(line => line.trim().length > 0);
    
    const cards: { id: string; quantity: number }[] = [];
    
    for (const line of lines) {
      // Match pattern like "4xOP01-001" or "1xEB02-003"
      const match = line.match(/^(\d+)x([A-Z]+\d{2}-\d{3})$/);
      
      if (!match) {
        return {
          success: false,
          cards: [],
          error: `Invalid format in line: ${line}. Expected format: "4xOP01-001"`
        };
      }
      
      const [, quantityStr, cardId] = match;
      const quantity = parseInt(quantityStr, 10);
      
      if (quantity < 1 || quantity > 4) {
        return {
          success: false,
          cards: [],
          error: `Invalid quantity in line: ${line}. Must be between 1 and 4.`
        };
      }
      
      cards.push({ id: cardId, quantity });
    }
    
    return {
      success: true,
      cards
    };
  } catch (error) {
    return {
      success: false,
      cards: [],
      error: 'Failed to parse deck formula'
    };
  }
}

export async function importDeck(formula: string, allCards: Card[]): Promise<{
  success: boolean;
  leader?: Card;
  cards: Card[];
  error?: string;
}> {
  const result = parseDeckFormula(formula);
  
  if (!result.success) {
    return {
      success: false,
      cards: [],
      error: result.error
    };
  }
  
  const importedCards: Card[] = [];
  let leader: Card | undefined;
  
  for (const { id, quantity } of result.cards) {
    const card = allCards.find(c => c.id === id);
    
    if (!card) {
      return {
        success: false,
        cards: [],
        error: `Card not found: ${id}`
      };
    }
    
    // If it's a leader card, set it as the leader
    if (card.type.toLowerCase() === 'leader') {
      if (quantity > 1) {
        return {
          success: false,
          cards: [],
          error: `Cannot have more than 1 leader card: ${id}`
        };
      }
      leader = card;
      continue;
    }
    
    // Add the card to the deck the specified number of times
    for (let i = 0; i < quantity; i++) {
      importedCards.push(card);
    }
  }
  
  return {
    success: true,
    leader,
    cards: importedCards
  };
} 