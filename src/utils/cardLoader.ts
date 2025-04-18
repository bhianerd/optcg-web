import { Card } from '../types/types';

export async function loadCards(): Promise<Card[]> {
  try {
    console.log('Fetching cards from:', '/data/en/cards.json');
    const response = await fetch('/data/en/cards.json');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw data type:', typeof data);
    console.log('Raw data keys:', Object.keys(data));
    
    // Extract cards from the nested structure
    const cardSets = data.card_sets || {};
    console.log('Card sets:', Object.keys(cardSets));
    
    const allCards = Object.values(cardSets).flatMap((set: any) => {
      console.log('Set:', set.set_id, 'Cards:', set.cards?.length);
      if (set.cards && set.cards.length > 0) {
        console.log('Sample card from set:', {
          id: set.cards[0].id,
          name: set.cards[0].name,
          color: set.cards[0].color,
          card_color: set.cards[0].card_color,
          card_type: set.cards[0].card_type
        });
      }
      return set.cards || [];
    });
    
    console.log('Total cards found:', allCards.length);

    // Transform the data to match our Card type
    const transformedCards = allCards.map((card: any) => {
      if (!card) {
        console.warn('Found null card in data');
        return null;
      }
      
      // Log the raw card data
      console.log('Raw card:', {
        id: card.id,
        name: card.name,
        color: card.color,
        card_color: card.card_color,
        card_type: card.card_type,
        cost: card.cost,
        power: card.power
      });
      
      // Determine the card's color
      const color = card.color || card.card_color || '';
      console.log('Card color determination:', {
        name: card.name,
        color: color,
        rawColor: card.color,
        rawCardColor: card.card_color
      });
      
      const transformed = {
        id: card.id || '',
        name: card.name || '',
        color: color.toLowerCase(),
        type: (card.card_type || '').toLowerCase(),
        cost: typeof card.cost === 'number' ? card.cost : 0,
        power: card.power || null,
        counter: card.counter || null,
        attribute: card.attribute || '',
        effect: card.effect_text || '',
        trigger: card.trigger_text || '',
        life: card.life || null,
        rarity: card.rarity || '',
        set_id: card.set_id || '',
        card_number: card.card_number || '',
        img_url: card.id ? `/data/en/images/${card.id}.png` : ''
      };

      console.log('Transformed card:', transformed);
      return transformed;
    }).filter(Boolean);

    console.log('Final transformed cards length:', transformedCards.length);
    return transformedCards;
  } catch (error) {
    console.error('Error loading cards:', error);
    return [];
  }
} 