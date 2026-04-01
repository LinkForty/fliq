# Fliq'd

A secret message app built with React Native and Expo. Create secret messages, choose a fun reveal style, and deliver them via push notification or shareable link. When the recipient opens the message, the app launches directly to the reveal screen where they flick their phone to uncover the secret.

All messages are encrypted end-to-end using AES-256-GCM. Not even the server can read them.

Fliq'd also integrates with [LinkForty](https://linkforty.com) for mobile attribution: click tracking, install attribution, and in-app event analytics — all visible in the LinkForty Cloud dashboard.

## Features

- **Push to Phone** — send secrets directly to a phone number via push notification. No links, no chat history, no trace.
- **Share Link** — generate a shareable URL and send it via iMessage, WhatsApp, or any messaging app
- **End-to-end encryption** — messages encrypted with AES-256-GCM on device; decryption key stays in the URL fragment and never reaches the server
- **Flick to reveal** — recipients flick their phone to uncover the secret message
- **Ephemeral push messages** — push-delivered messages are deleted from the server the moment they're opened
- **Deep linking** — Universal Links (iOS), App Links (Android), and custom scheme links route directly to the reveal screen
- **OTP phone verification** — phone numbers verified via Twilio OTP during onboarding
- **Onboarding** — guided setup with name, phone verification, and push notification permission
- **LinkForty integration** — optional SDK connection for click tracking, install attribution, and event analytics
- **Two modes** — works standalone (no backend needed for link sharing) or connected to a LinkForty dashboard

## Tech Stack

- [Expo SDK 55](https://docs.expo.dev/) with [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animations)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) (flick gesture detection)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (local message persistence)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) (push notification delivery)
- [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/) (AES-256-GCM encryption)
- [@linkforty/mobile-sdk-expo](https://github.com/linkforty/mobile-sdk-expo) (optional deep linking & attribution SDK)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/linkforty/fliq.git
cd fliq

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Press `i` to open in iOS Simulator or `a` for Android Emulator.

The app works immediately in **standalone mode** — no backend or API key required. Messages are encrypted and encoded directly into the share URL. Push notifications require the Fliq'd backend server (see `server/`).

## Delivery Modes

### Push to Phone

Send a secret directly to a recipient's phone number. The message is encrypted on the sender's device and delivered as a push notification.

- Requires both sender and recipient to have Fliq'd installed with push notifications enabled
- Messages are encrypted client-side before reaching the server
- Stored on the server only until opened, then permanently deleted
- If the recipient doesn't have Fliq'd, the app offers to fall back to link sharing

### Share Link

Generate a shareable URL and send it through any messaging app. The message is encrypted and the decryption key is embedded in the URL fragment (never sent to any server).

## Fliq'd Backend Server

The `server/` directory contains a Fastify server that powers push notification delivery and phone verification. See [`server/README.md`](server/README.md) for setup and API documentation.

The server handles:
- Device registration (phone number + push token)
- Push message delivery via Expo Push Notifications
- Ephemeral message storage (auto-deleted on read, 24h TTL)
- Phone number verification via Twilio OTP
- JWT authentication for authenticated endpoints

## LinkForty Integration

Connect Fliq'd to your LinkForty Cloud dashboard to see real analytics data:

### Setup

1. Sign up at [app.linkforty.com](https://app.linkforty.com) — a "Fliq'd Demo App" workspace with an API key is created automatically
2. Go to **Settings → API Keys** and copy the auto-generated key
3. In Fliq'd, tap the gear icon → paste your API key → tap **Connect**

### What Gets Tracked

Once connected, Fliq'd uses the LinkForty SDK instead of self-encoded URLs:

| Action | What appears in dashboard |
|--------|--------------------------|
| Share a message | A tracked short link is created (visible in Shared Links page) |
| Recipient taps the link | Click event with device, location, and referrer data |
| Recipient opens the app | Install attribution (if new install) |
| Recipient reveals the message | `message_revealed` custom event |

### How It Works

**Standalone mode** (no API key):
- Message payload is encrypted with AES-256-GCM and encoded into the share URL
- URL format: `https://fliq.linkforty.com/s?e=<ciphertext>&n=<nonce>#<key>`
- The decryption key is in the URL fragment and never sent to any server

**Connected mode** (with API key):
- `lib/sdk.ts` encrypts the message and calls `LinkFortySDK.createLink()` with encrypted data as `deepLinkParameters`
- LinkForty creates a tracked short link (e.g., `https://go.linkforty.com/slug/abc123#key`)
- The SDK's `onDeepLink()` handler intercepts incoming links, resolves them server-side, extracts the encrypted message from `customParameters`, and decrypts with the key from the URL fragment
- Events like `message_revealed` are tracked via `LinkFortySDK.trackEvent()`

## How Deep Linking Works

### Encrypted Share Links

Messages are encrypted with AES-256-GCM and the ciphertext is URL-encoded into the share URL:

```
https://fliq.linkforty.com/s?e=<ciphertext>&n=<nonce>#<decryption-key>
```

When the recipient taps this link:

1. **`app/s.tsx`** catches the URL, extracts the encrypted params and key from the fragment, decrypts the message, saves it to local storage, and redirects to the reveal screen
2. **`app/reveal/[id].tsx`** loads the message from storage and renders the flick reveal component

### App Scheme

The app also responds to `fliq://` scheme URLs for direct app-to-app linking from the interstitial page.

## Project Structure

```
app/
├── _layout.tsx          # Root layout (theme, SDK init, push + deep link handlers)
├── (tabs)/
│   ├── _layout.tsx      # Home screen layout
│   └── index.tsx        # Message list with swipe-to-delete
├── create.tsx           # Create & send a secret (push or link)
├── onboarding.tsx       # Guided setup (name, phone verification, push permissions)
├── reveal/[id].tsx      # Reveal screen (loads message by ID)
├── s.tsx                # Share link deep link entry point
└── settings.tsx         # Preferences, push registration, and LinkForty API key

components/
├── BlurReveal.tsx       # Tap-and-hold blur reveal animation
├── FlickReveal.tsx      # Flick gesture reveal animation
├── FlipReveal.tsx       # Card flip reveal animation
├── ScratchReveal.tsx    # Grid-based scratch-off reveal
└── TypewriterReveal.tsx # Character-by-character typewriter reveal

lib/
├── sdk.ts               # LinkForty SDK wrapper (two-mode pattern)
├── push.ts              # Push notification registration and messaging
├── settings.ts          # User preferences persistence
├── deep-link-router.ts  # SDK deep link → message → reveal navigation
├── deeplink.ts          # Standalone URL encoding/decoding
├── crypto.ts            # AES-256-GCM encryption/decryption
├── auth.ts              # JWT authentication helpers
├── phone-validation.ts  # Phone number validation and OTP
├── storage.ts           # AsyncStorage CRUD for messages and recipients
├── types.ts             # TypeScript type definitions
├── theme.tsx            # Dark/light/system theme provider
├── reveal-styles.ts     # Reveal style metadata
└── time.ts              # Relative time formatting

server/
├── src/
│   ├── index.ts         # Fastify API server for push delivery
│   ├── routes.ts        # API routes (devices, messages, phone verification)
│   ├── database.ts      # PostgreSQL schema and connection
│   ├── auth.ts          # JWT middleware
│   ├── authRoutes.ts    # OTP verification routes
│   ├── twilio.ts        # Twilio OTP integration
│   └── utils.ts         # Phone number normalization
├── package.json         # Server dependencies
└── README.md            # Server setup and API docs
```

## License

[MIT](LICENSE)
