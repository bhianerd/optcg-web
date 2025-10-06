import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from '../config/environment'
import * as schema from './schema'

// Create postgres client
const client = postgres(config.database.url, {
  max: 1, // Limit connection pool for serverless
})

// Create drizzle instance
export const db = drizzle(client, { schema })

// Export schema for use in other files
export * from './schema'
