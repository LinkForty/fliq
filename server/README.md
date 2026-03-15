# Fliq Server

Lightweight push messaging backend for the [Fliq](https://github.com/linkforty/fliq) app. Handles device registration, message relay via Expo push notifications, and ephemeral message storage.

Messages are stored temporarily (24-hour TTL) and deleted from the server the moment the recipient reads them.

## Stack

- **Runtime:** Node.js
- **Framework:** Fastify
- **Database:** PostgreSQL
- **Push:** Expo Server SDK (APNS + FCM)

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL running locally

### 1. Create the database

```bash
createdb fliq
```

Or via psql:

```sql
CREATE DATABASE fliq;
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your local PostgreSQL credentials:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/fliq
PORT=3100
NODE_ENV=development
```

### 3. Install dependencies and start

```bash
npm install
npm run dev
```

The server will start at `http://localhost:3100`. Database tables are created automatically on first run.

### 4. Verify

```bash
curl http://localhost:3100/health
```

## Docker

### Build and run

```bash
docker build -t fliq-server .
docker run -p 3100:3100 -e DATABASE_URL=postgresql://user:pass@host:5432/fliq fliq-server
```

### Docker Compose

To run the server with a PostgreSQL database:

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "3100:3100"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/fliq
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: fliq
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

```bash
docker compose up
```

## Deploying to Railway

1. Create a new Railway project
2. Add a PostgreSQL database
3. Add an empty service and link this directory
4. Set the `DATABASE_URL` variable to reference the Postgres service: `${{Postgres.DATABASE_URL}}`
5. Deploy — Railway will detect the Dockerfile automatically

## API

All endpoints are public (no authentication). The server is designed to be called directly from the Fliq mobile app.

### `GET /health`

Health check.

```json
{ "status": "ok", "timestamp": "2026-03-15T12:00:00.000Z" }
```

### `POST /api/devices`

Register or update a device for push notifications.

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `deviceId` | string | Yes | Stable device identifier (generated client-side) |
| `phoneNumber` | string | Yes | Phone number to receive messages at |
| `pushToken` | string | Yes | Expo push token |
| `displayName` | string | No | User's display name |
| `platform` | `"ios"` \| `"android"` | No | Device platform |

**Response:** `200 OK`

```json
{ "ok": true }
```

### `POST /api/messages`

Send a secret message. Stores the message and sends a push notification to the recipient.

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `senderDeviceId` | string | Yes | Sender's device ID |
| `senderName` | string | Yes | Sender's display name |
| `recipientPhone` | string | Yes | Recipient's phone number |
| `content` | string | Yes | Message content (max 2000 chars) |
| `revealStyle` | string | No | `flick`, `scratch`, `blur`, `typewriter`, or `flip` (default: `flick`) |

**Response:** `201 Created`

```json
{
  "messageId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-03-16T12:00:00.000Z"
}
```

**Error:** `404` if the recipient's phone number is not registered.

### `GET /api/messages/:id`

Fetch a message. This is a one-time read — the message is deleted from the server immediately after being returned.

**Response:** `200 OK`

```json
{
  "senderName": "Alice",
  "content": "This is the secret",
  "revealStyle": "flick",
  "createdAt": "2026-03-15T12:00:00.000Z"
}
```

**Error:** `404` if the message doesn't exist, was already read, or has expired.

## Database Schema

Tables are created automatically on server startup.

### `devices`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `device_id` | VARCHAR(64) | Unique client-generated device ID |
| `phone_number` | VARCHAR(20) | Phone number for receiving messages |
| `push_token` | TEXT | Expo push token |
| `display_name` | VARCHAR(100) | Optional display name |
| `platform` | VARCHAR(10) | `ios` or `android` |
| `created_at` | TIMESTAMP | Registration time |
| `updated_at` | TIMESTAMP | Last update time |

### `messages`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `sender_device_id` | VARCHAR(64) | Sender's device ID |
| `sender_name` | VARCHAR(100) | Sender's display name |
| `recipient_phone` | VARCHAR(20) | Recipient's phone number |
| `content` | TEXT | Message content |
| `reveal_style` | VARCHAR(20) | Reveal animation style |
| `created_at` | TIMESTAMP | Creation time |
| `expires_at` | TIMESTAMP | Auto-expiry time (24 hours after creation) |
| `fetched_at` | TIMESTAMP | Set when the message is read (then deleted) |

## Message Lifecycle

1. Sender calls `POST /api/messages` with recipient's phone number and message content
2. Server stores the message with a 24-hour TTL and sends a push notification via Expo
3. Recipient taps the notification, app calls `GET /api/messages/:id`
4. Server returns the message and deletes it immediately
5. If the recipient never opens it, an hourly cleanup job deletes expired messages

No message persists on the server beyond delivery.

## License

MIT
