import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Users table (extends Supabase auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// Decks table
export const decks = pgTable('decks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  leader: jsonb('leader').notNull(), // Card object
  cards: jsonb('cards').notNull().default('[]'), // Array of Card objects
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  is_public: text('is_public').default('false'), // 'true' | 'false'
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// Simple type definitions
export interface Card {
  id: string;
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
}

export interface Deck {
  id: string;
  name: string;
  leader: Card;
  cards: Card[];
  user_id?: string;
  is_public?: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InsertDeck {
  id?: string;
  name: string;
  leader: Card;
  cards: Card[];
  user_id?: string;
  is_public?: boolean;
  description?: string;
}

export interface SelectDeck {
  id: string;
  name: string;
  leader: Card;
  cards: Card[];
  user_id?: string;
  is_public?: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
