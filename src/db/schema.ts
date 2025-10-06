import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Users table (extends Supabase auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// Cards table - stores all available cards
export const cards = pgTable('cards', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  img_url: text('img_url').notNull(),
  color: text('color'),
  cost: integer('cost'),
  power: integer('power'),
  counter: integer('counter'),
  attribute: text('attribute'),
  effect: text('effect'),
  trigger: text('trigger'),
  life: integer('life'),
  rarity: text('rarity'),
  set_id: text('set_id'),
  card_number: text('card_number'),
  set: text('set'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// Decks table
export const decks = pgTable('decks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  leader_id: text('leader_id').notNull().references(() => cards.id),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  is_public: boolean('is_public').default(false),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// Deck cards table - many-to-many relationship between decks and cards
export const deckCards = pgTable('deck_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  deck_id: uuid('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  card_id: text('card_id').notNull().references(() => cards.id),
  count: integer('count').notNull().default(1),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

// Type definitions for the normalized schema
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
  created_at: Date;
  updated_at: Date;
}

export interface DeckCard {
  id: string;
  deck_id: string;
  card_id: string;
  count: number;
  created_at: Date;
}

export interface Deck {
  id: string;
  name: string;
  leader_id: string;
  user_id?: string;
  is_public: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
  // Populated fields (not in DB)
  leader?: Card;
  cards?: Array<Card & { count: number }>;
}

export interface InsertDeck {
  id?: string;
  name: string;
  leader_id: string;
  user_id?: string;
  is_public?: boolean;
  description?: string;
}

export interface SelectDeck {
  id: string;
  name: string;
  leader_id: string;
  user_id?: string;
  is_public: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
