export enum CardColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  BLACK = 'black'
}

export enum CardType {
  LEADER = 'leader',
  CHARACTER = 'character',
  EVENT = 'event',
  STAGE = 'stage',
  DON = 'don'
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'super_rare' | 'secret_rare';
export type CardSet = string;

export type Card = {
  id: string;
  instanceId?: string; // Unique ID for each instance of a card
  name: string;
  type: string;
  img_url: string;
  color?: string;
  cost?: number;
  power?: number;
  counter?: number;
  attribute?: string;
  effect?: string;
  trigger?: string;
  life?: number;
  rarity?: string;
  set_id?: string;
  card_number?: string;
  set?: string;
};

export interface Deck {
  id: string;
  name: string;
  leader: Card;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

