import type { Card } from '../types/types';

export type StackedCard = {
  card: Card;
  count: number;
};

export function groupCards(cards: Card[]): StackedCard[] {
  const cardGroups = new Map<string, number>();
  
  // Count occurrences of each card
  cards.forEach(card => {
    const count = cardGroups.get(card.id) || 0;
    cardGroups.set(card.id, count + 1);
  });
  
  // Convert to StackedCard array
  const stackedCards: StackedCard[] = [];
  cardGroups.forEach((count, cardId) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      stackedCards.push({ card, count });
    }
  });
  
  return stackedCards;
} 