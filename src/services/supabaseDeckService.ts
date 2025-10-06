import { supabase } from '../lib/supabase'
import { DeckModel } from '../db/models/DeckModel'
import type { Deck, Card } from '../db/schema'

export class SupabaseDeckService {
  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Get all decks for current user
  static async getDecks(): Promise<Deck[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      return await DeckModel.getDecksByUserId(user.id)
    } catch (error) {
      console.error('SupabaseDeckService: Error fetching decks:', error)
      return []
    }
  }

  // Get public decks
  static async getPublicDecks(): Promise<Deck[]> {
    try {
      return await DeckModel.getPublicDecks()
    } catch (error) {
      console.error('SupabaseDeckService: Error fetching public decks:', error)
      return []
    }
  }

  // Save a deck
  static async saveDeck(deck: Deck): Promise<Deck | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      // Convert app deck to database format
      const dbDeck = {
        id: deck.id,
        name: deck.name,
        leader: deck.leader,
        cards: deck.cards,
        user_id: user.id,
        is_public: deck.is_public ? 'true' : 'false',
        description: deck.description,
        created_at: deck.created_at,
        updated_at: new Date(),
      }

      // Check if deck exists
      const existingDeck = await DeckModel.getDeckById(deck.id)
      
      if (existingDeck) {
        return await DeckModel.updateDeck(deck.id, dbDeck)
      } else {
        return await DeckModel.createDeck(dbDeck)
      }
    } catch (error) {
      console.error('SupabaseDeckService: Error saving deck:', error)
      return null
    }
  }

  // Delete a deck
  static async deleteDeck(deckId: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      return await DeckModel.deleteDeck(deckId, user.id)
    } catch (error) {
      console.error('SupabaseDeckService: Error deleting deck:', error)
      return false
    }
  }

  // Search decks
  static async searchDecks(query: string): Promise<Deck[]> {
    try {
      const user = await this.getCurrentUser()
      return await DeckModel.searchDecks(query, user?.id)
    } catch (error) {
      console.error('SupabaseDeckService: Error searching decks:', error)
      return []
    }
  }

  // Sign in with email
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // Sign up with email
  static async signUpWithEmail(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })
    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get auth state changes
  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

