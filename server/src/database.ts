import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL must be set in production');
    }
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
      content_nonce VARCHAR(100),
      reveal_style VARCHAR(20) NOT NULL DEFAULT 'flick',
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP NOT NULL,
      fetched_at TIMESTAMP
    )
  `);

  // Add columns if table already exists without them
  await db.query(`
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS content_nonce VARCHAR(100)
  `);
  await db.query(`
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_phone VARCHAR(20)
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_phone)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_messages_expires ON messages(expires_at)');

  // Verified phones — cache validated phone numbers to avoid repeat API calls
  await db.query(`
    CREATE TABLE IF NOT EXISTS verified_phones (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone_number VARCHAR(20) NOT NULL UNIQUE,
      formatted VARCHAR(30),
      verified_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // OTP requests — rate limiting for verification attempts
  await db.query(`
    CREATE TABLE IF NOT EXISTS otp_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone_number VARCHAR(20) NOT NULL,
      requested_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_otp_requests_phone_time ON otp_requests(phone_number, requested_at)');

  // Blocks — recipient-side blocklist; blocked senders' messages are dropped
  await db.query(`
    CREATE TABLE IF NOT EXISTS blocks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      blocker_phone VARCHAR(20) NOT NULL,
      blocked_phone VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (blocker_phone, blocked_phone)
    )
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_phone)');

  // Reports — user reports of objectionable content, reviewed within 24h
  await db.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reporter_phone VARCHAR(20) NOT NULL,
      sender_phone VARCHAR(20),
      sender_name VARCHAR(100),
      message_id VARCHAR(64),
      message_content TEXT,
      reason VARCHAR(50) NOT NULL,
      details TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'open',
      resolution TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      resolved_at TIMESTAMP
    )
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status)');

  // Banned phones — ejected users; all authenticated requests are rejected
  await db.query(`
    CREATE TABLE IF NOT EXISTS banned_phones (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone_number VARCHAR(20) NOT NULL UNIQUE,
      reason TEXT,
      banned_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log('Database tables initialized');
}

/**
 * Delete expired and already-fetched messages.
 */
/**
 * Delete stale OTP request records older than 24 hours.
 */
export async function cleanupOtpRequests(): Promise<number> {
  const db = getPool();
  const result = await db.query(
    `DELETE FROM otp_requests WHERE requested_at < NOW() - INTERVAL '24 hours'`,
  );
  return result.rowCount || 0;
}

/**
 * Check whether a phone number has been banned by moderation.
 */
export async function isBanned(phone: string): Promise<boolean> {
  const db = getPool();
  const result = await db.query(
    `SELECT 1 FROM banned_phones WHERE phone_number = $1`,
    [phone],
  );
  return result.rows.length > 0;
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
