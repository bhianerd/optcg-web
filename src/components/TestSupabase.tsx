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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setStatus('✅ Signed out!')
    } catch (err) {
      setError(`Sign out error: ${err}`)
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
      
      <div className="space-x-2">
        <button
          onClick={handleSignUp}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Sign Up Test
        </button>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

