import { Pool } from "pg";

// Raw SQL client for crawler database (schema doesn't match Prisma)
const globalForPool = globalThis as unknown as {
  pool: Pool | undefined;
};

function createPool() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set");
    return null;
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

export const pool = globalForPool.pool ?? createPool();

if (process.env.NODE_ENV !== "production" && pool) {
  globalForPool.pool = pool;
}

// Helper for queries
export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  if (!pool) {
    throw new Error("Database pool not initialized");
  }
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

// Helper for single result
export async function queryOne<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
