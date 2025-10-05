# Drizzle ORM Setup

This project now uses Drizzle ORM for database operations with Supabase as the backend.

## Project Structure

```
src/
├── db/
│   ├── schemas/          # Database schema definitions
│   │   └── decks.ts      # Deck table schema
│   ├── models/           # Database models with CRUD operations
│   │   ├── DeckModel.ts  # Deck model with all operations
│   │   └── index.ts      # Export all models
│   ├── migrations/       # Database migrations (auto-generated)
│   ├── connection.ts     # Database connection setup
│   └── init.ts          # Database initialization
├── services/
│   └── deckService.ts    # Service layer using models
└── lib/
    └── supabase.ts       # Supabase client (for auth/real-time)
```

## Key Features

### 1. Type-Safe Schema
- **File**: `src/db/schemas/decks.ts`
- Defines the database table structure with full TypeScript support
- Includes relations and type inference

### 2. Model Layer
- **File**: `src/db/models/DeckModel.ts`
- Contains all CRUD operations for decks
- Methods: `getAllDecks()`, `getDeckById()`, `createDeck()`, `updateDeck()`, `deleteDeck()`, `upsertDeck()`

### 3. Service Layer
- **File**: `src/services/deckService.ts`
- Acts as a bridge between Redux and the database models
- Maintains the same interface as before

### 4. Database Connection
- **File**: `src/db/connection.ts`
- Configures Drizzle with PostgreSQL connection
- Uses environment variables for connection string

## Environment Variables

```env
# Database Configuration (for Drizzle)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Supabase Configuration (for auth/real-time)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

## Usage

### 1. Start Local Supabase
```bash
npx supabase start
```

### 2. Run the Application
```bash
npm run dev
```

### 3. Test Drizzle Integration
- Navigate to `/test-drizzle` in your browser
- Use the test interface to verify database operations

## Database Operations

### Using the Model Directly
```typescript
import { DeckModel } from '../db/models/DeckModel';

// Get all decks
const decks = await DeckModel.getAllDecks();

// Create a new deck
const newDeck = await DeckModel.createDeck(deckData);

// Update a deck
const updatedDeck = await DeckModel.updateDeck(deckId, updateData);

// Delete a deck
const success = await DeckModel.deleteDeck(deckId);
```

### Using the Service Layer
```typescript
import { DeckService } from '../services/deckService';

// Get all decks
const decks = await DeckService.getDecks();

// Save a deck
const savedDeck = await DeckService.saveDeck(deck);

// Delete a deck
const success = await DeckService.deleteDeck(deckId);
```

## Benefits of Drizzle

1. **Type Safety**: Full TypeScript support with inferred types
2. **Performance**: Lightweight and fast
3. **Developer Experience**: Great autocomplete and error checking
4. **Flexibility**: Works with any PostgreSQL database
5. **Migration Support**: Built-in migration system
6. **Query Builder**: Intuitive query building API

## Testing

The Drizzle integration can be tested using the `/test-drizzle` route which provides:
- Database connection status
- Direct model testing
- Redux integration testing
- CRUD operation verification

## Migration from Raw Supabase

The migration maintains the same service interface, so no changes are needed in your Redux slices or components. The benefits are:
- Better type safety
- Cleaner code organization
- Easier testing
- Better performance
- More maintainable database operations

