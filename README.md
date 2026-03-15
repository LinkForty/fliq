# Fliq

A secret message app built with React Native and Expo. Create secret messages, choose a fun reveal style, and deliver them via push notification or shareable link. When the recipient opens the message, the app launches directly to the reveal screen where they flick their phone to uncover the secret.

Fliq also integrates with [LinkForty](https://linkforty.com) for mobile attribution: click tracking, install attribution, and in-app event analytics — all visible in the LinkForty Cloud dashboard.

## Features

- **Push to Phone** — send secrets directly to a phone number via push notification. No links, no chat history, no trace.
- **Share Link** — generate a shareable URL and send it via iMessage, WhatsApp, or any messaging app
- **Flick to reveal** — recipients flick their phone to uncover the secret message
- **Ephemeral push messages** — push-delivered messages are deleted from the server the moment they're opened
- **Deep linking** — universal links and app scheme links route directly to the reveal screen
- **Onboarding** — guided setup with name, phone number, and push notification permission
- **LinkForty integration** — optional SDK connection for click tracking, install attribution, and event analytics
- **Two modes** — works standalone (no backend) or connected to a LinkForty dashboard

## Tech Stack

- [Expo SDK 55](https://docs.expo.dev/) with [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animations)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (local message persistence)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) (push notification delivery)
- [@linkforty/mobile-sdk-expo](https://github.com/linkforty/core) (optional deep linking & attribution SDK)

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

The app works immediately in **standalone mode** — no backend or API key required. Messages are base64-encoded directly into the share URL. Push notifications require the Fliq backend server (see `server/`).

## Delivery Modes

### Push to Phone

Send a secret directly to a recipient's phone number. The message is delivered as a push notification and the recipient opens it directly in the app.

- Requires both sender and recipient to have Fliq installed with push notifications enabled
- Messages are stored on the server only until opened, then permanently deleted
- If the recipient doesn't have Fliq, the app offers to fall back to link sharing

### Share Link

Generate a shareable URL and send it through any messaging app. Works without any backend — the message is encoded directly into the URL.

## Fliq Backend Server

The `server/` directory contains a lightweight Express server that powers push notification delivery. See [`server/README.md`](server/README.md) for setup and API documentation.

The server handles:
- Device registration (phone number + push token)
- Push message delivery via Expo Push Notifications
- Ephemeral message storage (auto-deleted on read, 24h TTL)

## LinkForty Integration

Connect Fliq to your LinkForty Cloud dashboard to see real analytics data:

### Setup

1. Sign up at [app.linkforty.com](https://app.linkforty.com) (all plans include API access)
2. Go to **Settings → API Keys** and create a new key
3. In Fliq, tap the gear icon → paste your API key → tap **Connect**

### What Gets Tracked

Once connected, Fliq uses the LinkForty SDK instead of self-encoded URLs:

| Action | What appears in dashboard |
|--------|--------------------------|
| Share a message | A tracked short link is created (visible in Links page) |
| Recipient taps the link | Click event with device, location, and referrer data |
| Recipient opens the app | Install attribution (if new install) |
| Recipient reveals the message | `message_revealed` custom event |

### How It Works

**Standalone mode** (no API key):
- Message payload is base64-encoded into the share URL: `https://fliq.linkforty.com/s?m=...`
- `app/s.tsx` decodes the URL, saves the message, and redirects to the reveal screen

**Connected mode** (with API key):
- `lib/sdk.ts` calls `LinkFortySDK.createLink()` with the message as `deepLinkParameters`
- LinkForty creates a tracked short link (e.g., `https://go.linkforty.com/slug/abc123`)
- The SDK's `onDeepLink()` handler intercepts incoming links, resolves them server-side, extracts the message from `customParameters`, and routes to the reveal screen
- Events like `message_revealed` are tracked via `LinkFortySDK.trackEvent()`

## How Deep Linking Works

### Standalone Deep Links

Messages are encoded into a URL-safe base64 string and appended to the share URL:

```
https://fliq.linkforty.com/s?m=eyJjb250ZW50Ijoi...
```

When the recipient taps this link:

1. **`app/s.tsx`** catches the URL, decodes the `m` parameter, saves the message to local storage, and redirects to the reveal screen
2. **`app/reveal/[id].tsx`** loads the message from storage and renders the appropriate reveal component

### App Scheme

The app also responds to `fliq://s?m=...` for direct app-to-app linking.

## Project Structure

```
app/
├── _layout.tsx          # Root layout (theme, SDK init, deep link handlers)
├── (tabs)/
│   ├── _layout.tsx      # Home screen layout
│   └── index.tsx        # Message list with FAB
├── create.tsx           # Create & send a secret (push or link)
├── onboarding.tsx       # Guided setup (name, phone, push permissions)
├── reveal/[id].tsx      # Reveal screen (loads message by ID)
├── s.tsx                # Standalone deep link entry point
└── settings.tsx         # Profile, push registration, and LinkForty API key

components/
├── BlurReveal.tsx       # Tap-and-hold blur reveal animation
└── ScratchReveal.tsx    # Grid-based scratch-off reveal

lib/
├── sdk.ts               # LinkForty SDK wrapper (two-mode pattern)
├── push.ts              # Push notification registration and messaging
├── settings.ts          # User preferences persistence
├── deep-link-router.ts  # SDK deep link → message → reveal navigation
├── deeplink.ts          # Standalone URL encoding/decoding
├── storage.ts           # AsyncStorage CRUD for messages
├── types.ts             # TypeScript type definitions
├── reveal-styles.ts     # Reveal style metadata
└── time.ts              # Relative time formatting

server/
├── index.ts             # Express API server for push delivery
├── package.json         # Server dependencies
└── README.md            # Server setup and API docs
```

## License

[MIT](LICENSE)
