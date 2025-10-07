import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Supabase connection by checking if tables exist
        const tests = []
        
        // Test users table
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('count')
          .limit(1)
        tests.push({ table: 'users', success: !usersError })
        
        // Test cards table
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('count')
          .limit(1)
        tests.push({ table: 'cards', success: !cardsError })
        
        // Test decks table
        const { data: decksData, error: decksError } = await supabase
          .from('decks')
          .select('count')
          .limit(1)
        tests.push({ table: 'decks', success: !decksError })
        
        // Test deck_cards table
        const { data: deckCardsData, error: deckCardsError } = await supabase
          .from('deck_cards')
          .select('count')
          .limit(1)
        tests.push({ table: 'deck_cards', success: !deckCardsError })
        
        const allSuccess = tests.every(t => t.success)
        
        if (allSuccess) {
          setStatus('✅ Connected to Supabase! All tables found.')
        } else {
          const failedTables = tests.filter(t => !t.success).map(t => t.table)
          setError(`Missing tables: ${failedTables.join(', ')}`)
          setStatus('⚠️ Connected but missing tables')
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.log('No user logged in:', userError.message)
        } else {
          setUser(user)
        }
      } catch (err) {
        setError(`Connection error: ${err}`)
        setStatus('❌ Connection failed')
      }
    }

    testConnection()
  }, [])

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
          },
        },
      })
      
      if (error) throw error
      setUser(data.user)
      setStatus('✅ User signed up!')
    } catch (err) {
      setError(`Sign up error: ${err}`)
    }
  }

  const handleSignIn = async () => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })
      
      if (error) throw error
      setUser(data.user)
      setStatus('✅ Signed in successfully!')
    } catch (err) {
      setError(`Sign in error: ${err}`)
      setStatus('❌ Sign in failed')
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setStatus('✅ Signed out!')
    } catch (err) {
      setError(`Sign out error: ${err}`)
    }
  }

  const handleTestInsertCard = async () => {
    try {
      setStatus('Testing card insert...')
      setError(null)
      
      // Try to insert a test card
      const { data, error } = await supabase
        .from('cards')
        .insert({
          id: 'TEST-001',
          name: 'Test Card',
          type: 'character',
          img_url: '/test.jpg',
          color: 'red',
          cost: 3,
          power: 4000,
        })
        .select()
        .single()
      
      if (error) {
        if (error.message.includes('duplicate key')) {
          setStatus('⚠️ Card already exists (that\'s ok!)')
        } else {
          setError(`Insert error: ${error.message}`)
          setStatus('❌ Insert failed')
        }
      } else {
        setStatus('✅ Card inserted successfully!')
        console.log('Inserted card:', data)
      }
    } catch (err) {
      setError(`Insert error: ${err}`)
      setStatus('❌ Insert failed')
    }
  }

  const handleTestReadCard = async () => {
    try {
      setStatus('Testing card read...')
      setError(null)
      
      // Try to read the test card
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', 'TEST-001')
        .single()
      
      if (error) {
        setError(`Read error: ${error.message}`)
        setStatus('❌ Read failed')
      } else {
        setStatus(`✅ Card found: ${data.name} (${data.color})`)
        console.log('Found card:', data)
      }
    } catch (err) {
      setError(`Read error: ${err}`)
      setStatus('❌ Read failed')
    }
  }

  const handleTestCreateDeck = async () => {
    try {
      setStatus('Testing deck creation...')
      setError(null)
      
      // Step 0: Check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        setError('Not authenticated! Click "Sign Up Test" first.')
        setStatus('❌ Need to sign up first')
        return
      }
      
      // Step 1: Ensure we have a leader card
      const { data: leaderCard, error: leaderError } = await supabase
        .from('cards')
        .select('*')
        .eq('id', 'TEST-001')
        .single()
      
      if (leaderError) {
        setError('Leader card not found. Click "Test Insert Card" first!')
        setStatus('❌ Need leader card')
        return
      }
      
      // Step 2: Create a deck (include user_id)
      const { data: deck, error: deckError } = await supabase
        .from('decks')
        .insert({
          name: 'Test Deck',
          leader_id: 'TEST-001',
          user_id: currentUser.id,  // Add user_id for RLS policy
          is_public: false,
          description: 'A test deck',
        })
        .select()
        .single()
      
      if (deckError) {
        setError(`Deck creation error: ${deckError.message}`)
        setStatus('❌ Deck creation failed')
        return
      }
      
      console.log('Created deck:', deck)
      setStatus(`✅ Deck created! ID: ${deck.id.substring(0, 8)}...`)
    } catch (err) {
      setError(`Deck creation error: ${err}`)
      setStatus('❌ Deck creation failed')
    }
  }

  return (
    <div className="p-4 bg-blue-100 rounded-lg max-w-md">
      <h3 className="font-bold text-lg mb-2">Supabase Integration Test</h3>
      <p className="mb-2">Status: {status}</p>
      
      {user && (
        <div className="mb-2 p-2 bg-green-100 rounded">
          <p className="text-sm">User: {user.email}</p>
          <p className="text-sm">ID: {user.id}</p>
        </div>
      )}
      
      {error && (
        <p className="text-red-600 text-sm mb-2">Error: {error}</p>
      )}
      
      <div className="space-x-2 space-y-2">
        <button
          onClick={handleSignUp}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Sign Up Test
        </button>
        <button
          onClick={handleSignIn}
          className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
        >
          Sign In
        </button>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Sign Out
        </button>
        <button
          onClick={handleTestInsertCard}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          Test Insert Card
        </button>
        <button
          onClick={handleTestReadCard}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
        >
          Test Read Card
        </button>
        <button
          onClick={handleTestCreateDeck}
          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
        >
          Test Create Deck
        </button>
      </div>
    </div>
  )
}

