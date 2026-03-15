import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/fliq',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

/**
 * Create the Fliq database tables if they don't exist.
 */
export async function initializeDatabase() {
  const db = getPool();

  // Devices — maps phone numbers to Expo push tokens
  await db.query(`
    CREATE TABLE IF NOT EXISTS devices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      device_id VARCHAR(64) NOT NULL UNIQUE,
      phone_number VARCHAR(20) NOT NULL,
      push_token TEXT NOT NULL,
      display_name VARCHAR(100),
      platform VARCHAR(10),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_devices_phone ON devices(phone_number)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_devices_device_id ON devices(device_id)');

  // Messages — ephemeral, deleted on fetch or expiry
  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_device_id VARCHAR(64) NOT NULL,
      sender_name VARCHAR(100) NOT NULL,
      recipient_phone VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      reveal_style VARCHAR(20) NOT NULL DEFAULT 'flick',
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP NOT NULL,
      fetched_at TIMESTAMP
    )
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_phone)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_messages_expires ON messages(expires_at)');

  console.log('Database tables initialized');
}

/**
 * Delete expired and already-fetched messages.
 */
export async function cleanupMessages(): Promise<number> {
  const db = getPool();
  const result = await db.query(
    `DELETE FROM messages WHERE expires_at < NOW() OR fetched_at IS NOT NULL`,
  );
  return result.rowCount || 0;
}
