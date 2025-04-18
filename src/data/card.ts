import { CardColor, CardType, type Card } from '../types/types';

export const cardsData: Card[] = [
  // Leaders
  {
    id: 'leader-001',
    name: 'Monkey D. Luffy',
    type: CardType.LEADER,
    color: CardColor.RED,
    power: 5000,
    cost: 0,
    effect: 'When attacking, +1000 power for each character you control.',
    img_url: 'https://placeholder.com/luffy.jpg',
    rarity: 'common',
    set_id: 'base',
    card_number: '1',
  },
]