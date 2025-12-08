import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Prisma 7: Set DATABASE_URL if not already set (for Railway PostgreSQL)
const databaseUrl = process.env.DATABASE_URL || 
  'postgresql://postgres:uJFZpiEKFILLbImYbtXDudvyqZazpdYn@maglev.proxy.rlwy.net:36655/railway'

// Prisma 7: Create PostgreSQL adapter
const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)

// Prisma 7: PrismaClient requires an adapter for PostgreSQL
export const prisma = new PrismaClient({ adapter })
