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

export function exportDeckToFormula(leader: Card | null, cards: Card[]): string {
  const lines: string[] = [];
  
  // Add leader if present
  if (leader) {
    lines.push(`1x${leader.id}`);
  }
  
  // Add other cards
  const stackedCards = groupCards(cards);
  stackedCards.forEach(({ card, count }) => {
    lines.push(`${count}x${card.id}`);
  });
  
  return lines.join('\n');
} 