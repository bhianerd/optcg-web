import type { Card } from '../types/types';
import { CardColor, CardType } from '../types/types';

type RawCard = {
  id: string;
  name: string;
  colors: string[];
  category: string;
  cost: number;
  power: number;
  counter: number;
  rarity: string;
  attributes: string[];
  types: string[];
  effect: string | null;
  trigger: string | null;
};

type CardSet = {
  cards: RawCard[];
};

type CardData = {
  card_sets: Record<string, CardSet>;
};

export async function loadCards(): Promise<Card[]> {
  try {
    console.log('Fetching cards from:', '/data/en/cards.json');
    const response = await fetch('/data/en/cards.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    
    const data = await response.json() as CardData;
    const cardSets = data.card_sets;
    const allCards = Object.values(cardSets).flatMap(set => set.cards);
    
    // Transform the data to match our Card type with proper enum values
    const transformedCards = allCards.filter(Boolean).map((card): Card | null => {
      // Handle colors array - take the first color if available
      let color: CardColor;
      if (card.colors.length > 0) {
        const rawColor = card.colors[0].toLowerCase();
        switch (rawColor) {
          case 'red': color = CardColor.RED; break;
          case 'blue': color = CardColor.BLUE; break;
          case 'green': color = CardColor.GREEN; break;
          case 'yellow': color = CardColor.YELLOW; break;
          case 'purple': color = CardColor.PURPLE; break;
          case 'black': color = CardColor.BLACK; break;
          default:
            console.warn(`Invalid color for card ${card.name}:`, rawColor);
            return null;
        }
      } else {
        console.warn(`No colors found for card ${card.name}`);
        return null;
      }

      // Convert category to CardType enum
      let type: CardType;
      const rawType = card.category.toLowerCase();
      switch (rawType) {
        case 'leader': type = CardType.LEADER; break;
        case 'character': type = CardType.CHARACTER; break;
        case 'event': type = CardType.EVENT; break;
        case 'stage': type = CardType.STAGE; break;
        case 'don': type = CardType.DON; break;
        default:
          console.warn(`Invalid type for card ${card.name}:`, rawType);
          return null;
      }

      const transformed: Card = {
        id: card.id,
        name: card.name,
        color: color,
        type: type,
        cost: card.cost,
        power: card.power,
        counter: card.counter,
        attribute: card.attributes.join(', '),
        effect: card.effect ?? '',
        trigger: card.trigger ?? '',
        life:  type == CardType.LEADER ? card.cost : 0,
        rarity: card.rarity,
        set_id: card.id.split('-')[0],
        card_number: card.id.split('-')[1],
        img_url: `/data/en/images/${card.id}.png`
      };

      return transformed;
    }).filter((card): card is Card => card !== null);

    console.log('Final transformed cards:', transformedCards.length);
    return transformedCards;
  } catch (error) {
    console.error('Error loading cards:', error);
    return [];
  }
} 