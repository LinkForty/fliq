# Fliq

A secret message app built with React Native and Expo. Create encrypted messages, choose a fun reveal style (scratch-off or blur), and share them via a link. When the recipient taps the link, the app opens directly to the reveal screen - demonstrating **direct deep linking** with Expo Router.

Fliq also integrates with [LinkForty](https://linkforty.com) to demonstrate real-world mobile attribution: click tracking, install attribution, and in-app event analytics - all visible in the LinkForty Cloud dashboard.

## Features

- **Create secret messages** - write a message, pick a reveal style, and share via the native share sheet
- **Scratch-off reveal** - drag your finger to scratch away the overlay and uncover the message
- **Blur reveal** - tap and hold to gradually deblur the message; release to snap back
- **Deep linking** - universal links and app scheme links route directly to the reveal screen
- **LinkForty integration** - optional SDK connection for click tracking, install attribution, and event analytics
- **Two modes** - works standalone (no backend) or connected to a LinkForty dashboard

## Tech Stack

- [Expo SDK 55](https://docs.expo.dev/) with [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animations)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (local message persistence)
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

The app works immediately in **standalone mode** - no backend or API key required. Messages are base64-encoded directly into the share URL.

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
│   ├── _layout.tsx      # Home screen layout with settings gear
│   └── index.tsx        # Message list with FAB
├── create.tsx           # Create & share a secret message
├── reveal/[id].tsx      # Reveal screen (loads message by ID)
├── s.tsx                # Standalone deep link entry point
└── settings.tsx         # LinkForty API key configuration

components/
├── BlurReveal.tsx       # Tap-and-hold blur reveal animation
└── ScratchReveal.tsx    # Grid-based scratch-off reveal

lib/
├── sdk.ts               # LinkForty SDK wrapper (two-mode pattern)
├── settings.ts          # API key persistence
├── deep-link-router.ts  # SDK deep link → message → reveal navigation
├── deeplink.ts          # Standalone URL encoding/decoding
├── storage.ts           # AsyncStorage CRUD for messages
├── types.ts             # TypeScript type definitions
├── reveal-styles.ts     # Reveal style metadata
└── time.ts              # Relative time formatting
```

## License

[MIT](LICENSE)
