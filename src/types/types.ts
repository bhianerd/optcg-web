export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'black';
export type CardType = 'leader' | 'character' | 'event' | 'stage' | 'don';

export interface Card {
    id: string;
    name: string;
    type: CardType;
    color: CardColor;
    img_url: string;
    power?: number;
    cost: number;
    effect: string;  
}

export interface Deck {
    id: string;
    name: string;
    leader: Card | null;
    cards: Card[];
    createdAt: Date;
    updatedAt: Date;
}

