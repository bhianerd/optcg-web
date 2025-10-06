import { eq, and, desc } from 'drizzle-orm'
import { db } from '../connection'
import { decks, type Deck, type InsertDeck, type Card } from '../schema'

export class DeckModel {
  // Get all decks for a user
  static async getDecksByUserId(userId: string): Promise<Deck[]> {
    try {
      const result = await db
        .select()
        .from(decks)
        .where(eq(decks.user_id, userId))
        .orderBy(desc(decks.updated_at))
      
      return result.map(this.mapDbDeckToAppDeck)
    } catch (error) {
      console.error('Error fetching decks by user ID:', error)
      return []
    }
  }

  // Get all public decks
  static async getPublicDecks(): Promise<Deck[]> {
    try {
      const result = await db
        .select()
        .from(decks)
        .where(eq(decks.is_public, 'true'))
        .orderBy(desc(decks.updated_at))
      
      return result.map(this.mapDbDeckToAppDeck)
    } catch (error) {
      console.error('Error fetching public decks:', error)
      return []
    }
  }

  // Get a single deck by ID
  static async getDeckById(deckId: string): Promise<Deck | null> {
    try {
      const result = await db
        .select()
        .from(decks)
        .where(eq(decks.id, deckId))
        .limit(1)
      
      if (result.length === 0) return null
      return this.mapDbDeckToAppDeck(result[0])
    } catch (error) {
      console.error('Error fetching deck by ID:', error)
      return null
    }
  }

  // Create a new deck
  static async createDeck(deck: InsertDeck): Promise<Deck | null> {
    try {
      const result = await db
        .insert(decks)
        .values(deck)
        .returning()
      
      if (result.length === 0) return null
      return this.mapDbDeckToAppDeck(result[0])
    } catch (error) {
      console.error('Error creating deck:', error)
      return null
    }
  }

  // Update an existing deck
  static async updateDeck(deckId: string, updates: Partial<InsertDeck>): Promise<Deck | null> {
    try {
      const result = await db
        .update(decks)
        .set({
          ...updates,
          updated_at: new Date(),
        })
        .where(eq(decks.id, deckId))
        .returning()
      
      if (result.length === 0) return null
      return this.mapDbDeckToAppDeck(result[0])
    } catch (error) {
      console.error('Error updating deck:', error)
      return null
    }
  }

  // Delete a deck
  static async deleteDeck(deckId: string, userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(decks)
        .where(and(
          eq(decks.id, deckId),
          eq(decks.user_id, userId)
        ))
        .returning()
      
      return result.length > 0
    } catch (error) {
      console.error('Error deleting deck:', error)
      return false
    }
  }

  // Search decks by name
  static async searchDecks(query: string, userId?: string): Promise<Deck[]> {
    try {
      let whereClause = eq(decks.is_public, 'true')
      
      if (userId) {
        // Include user's own decks
        whereClause = and(
          eq(decks.is_public, 'true'),
          eq(decks.user_id, userId)
        )
      }

      const result = await db
        .select()
        .from(decks)
        .where(whereClause)
        .orderBy(desc(decks.updated_at))
      
      // Filter by name (case-insensitive)
      const filtered = result.filter(deck => 
        deck.name.toLowerCase().includes(query.toLowerCase())
      )
      
      return filtered.map(this.mapDbDeckToAppDeck)
    } catch (error) {
      console.error('Error searching decks:', error)
      return []
    }
  }

  // Map database deck to app deck format
  private static mapDbDeckToAppDeck(dbDeck: any): Deck {
    return {
      id: dbDeck.id,
      name: dbDeck.name,
      leader: dbDeck.leader as Card,
      cards: dbDeck.cards as Card[],
      user_id: dbDeck.user_id,
      is_public: dbDeck.is_public === 'true',
      description: dbDeck.description,
      created_at: new Date(dbDeck.created_at),
      updated_at: new Date(dbDeck.updated_at),
    }
  }
}