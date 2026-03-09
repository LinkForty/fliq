# Fliq

A secret message app built with React Native and Expo. Create encrypted messages, choose a fun reveal style (scratch-off or blur), and share them via a link. When the recipient taps the link, the app opens directly to the reveal screen — demonstrating **direct deep linking** with Expo Router.

## Features

- **Create secret messages** — write a message, pick a reveal style, and share via the native share sheet
- **Scratch-off reveal** — drag your finger to scratch away the overlay and uncover the message
- **Blur reveal** — tap and hold to gradually deblur the message; release to snap back
- **Deep linking** — universal links (`https://fliq.linkforty.com/s?m=...`) and app scheme links (`fliq://s?m=...`) route directly to the reveal screen
- **No backend required** — message payloads are base64-encoded into the share URL itself

## Tech Stack

- [Expo SDK 55](https://docs.expo.dev/) with [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animations)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (local message persistence)

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

## How Deep Linking Works

Messages are encoded into a URL-safe base64 string and appended to the share URL:

```
https://fliq.linkforty.com/s?m=eyJjb250ZW50Ijoi...
```

When the recipient taps this link:

1. **`app/s.tsx`** catches the URL, decodes the `m` parameter, saves the message to local storage, and redirects to the reveal screen
2. **`app/reveal/[id].tsx`** loads the message from storage and renders the appropriate reveal component (scratch-off or blur)

This works for both cold start (app was closed) and warm start (app in background).

### URL Structure

| Part | Description |
|------|-------------|
| `https://fliq.linkforty.com/s` | Universal link base URL |
| `?m=<base64>` | URL-safe base64-encoded JSON: `{ content, revealStyle, senderName }` |

### App Scheme

The app also responds to `fliq://s?m=...` for direct app-to-app linking.

## Project Structure

```
app/
├── _layout.tsx          # Root layout (theme, navigation stack)
├── (tabs)/
│   ├── _layout.tsx      # Home screen layout
│   └── index.tsx        # Message list with FAB
├── create.tsx           # Create & share a secret message
├── reveal/[id].tsx      # Reveal screen (loads message by ID)
└── s.tsx                # Deep link entry point

components/
├── BlurReveal.tsx       # Tap-and-hold blur reveal animation
└── ScratchReveal.tsx    # Grid-based scratch-off reveal

lib/
├── deeplink.ts          # URL encoding/decoding, share URL generation
├── storage.ts           # AsyncStorage CRUD for messages
├── types.ts             # TypeScript type definitions
├── reveal-styles.ts     # Reveal style metadata
└── time.ts              # Relative time formatting
```

## License

[MIT](LICENSE)
