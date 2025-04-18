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
    name: string;
    type: CardType;
    color: CardColor;
    img_url: string;
    power?: number;
    cost: number;
    effect: string;
    rarity: CardRarity;
    set: CardSet;
};

export type Deck = {
    id: string;
    name: string;
    leader: string | null;
    cards: string[];
    createdAt: Date;
    updatedAt: Date;
};

