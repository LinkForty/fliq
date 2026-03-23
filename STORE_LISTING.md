# Fliq - App Store Listing

## App Name
Fliq - Secret Messages

## Subtitle (iOS, 30 chars max)
Send secrets with a flick

## Short Description (Google Play, 80 chars max)
Send secret messages that friends reveal by flicking their phone.

## Full Description

Send secret messages with a twist — recipients have to flick their phone to reveal what you wrote.

Fliq is a fun, privacy-first messaging app where every message is hidden behind a playful reveal animation. Send a secret directly to a phone number or share a link — then watch your friends flick to uncover it.

HOW IT WORKS

1. Write your secret message
2. Choose a delivery method — push it to a phone number or share a link
3. Your friend opens it and flicks their phone to reveal the secret

PUSH TO PHONE

Send secrets directly to a friend's phone number via push notification. No links, no chat history, no trace. Messages are deleted from the server the moment they're opened.

SHARE A LINK

Generate an encrypted shareable link and send it through iMessage, WhatsApp, or any messaging app. The message is encrypted on your device — the link contains only ciphertext that no one can read without the decryption key.

PRIVACY BY DESIGN

- Zero-knowledge encryption — messages are encrypted on your device with AES-256-GCM before leaving your phone
- Not even Fliq can read your messages — the decryption key never touches our servers
- Push messages are deleted from the server the moment they're read
- Messages auto-delete after reading (configurable)
- No ads, no tracking, no data collection
- Open source — see exactly how it works

FEATURES

- Push to Phone — send secrets directly to a phone number via push notification
- Share Link — send via iMessage, WhatsApp, Instagram, or any messaging app
- Flick to reveal — give your phone a quick shake to uncover the secret
- Ephemeral messages — push-delivered secrets are deleted from the server on read
- Dark mode — looks great day or night
- Works offline — create and read link-shared messages without internet

OPEN SOURCE

Fliq is built by LinkForty and is fully open source under the MIT license. View the code, suggest features, or contribute at github.com/linkforty/fliq.

## Keywords (iOS, 100 chars max)
secret,message,flick,reveal,hidden,fun,privacy,share,anonymous,link

## Category
- Primary: Entertainment
- Secondary: Social Networking

## Age Rating
- 4+ (iOS) / Everyone (Android)
- No objectionable content
- User-generated content: Yes (messages)
- No in-app purchases
- No ads

## Privacy Policy URL
https://fliq.linkforty.com/privacy

## Terms of Service URL
https://fliq.linkforty.com/terms

## Support URL
https://github.com/linkforty/fliq/issues

## Marketing URL
https://linkforty.com

## Copyright
© 2026 SiteTransition LLC

## Screenshots Needed

### iPhone 6.7" (required — iPhone 15 Pro Max, 1290x2796)
1. Onboarding — "Welcome to Fliq" with 🤫 emoji
2. Create message screen — composing a secret with "Push to Phone" selected
3. Create message screen — "Share Link" delivery mode selected
4. Flick reveal — cover screen with 🫰 "Flick to reveal" prompt
5. Message revealed — secret text visible after flicking

### iPhone 6.5" (required — iPhone 11 Pro Max, 1242x2688)
Same 5 screenshots at this resolution

### iPad 12.9" (optional, if supportsTablet stays true)
Same screenshots at iPad resolution

### Android Phone (Google Play, min 320px, max 3840px per side)
Same 5 screenshots

## App Preview Video (optional)
15-30 second demo:
1. Open app, tap + to create message
2. Type a secret, select Flick style
3. Tap Share, send via iMessage
4. Switch to recipient view, open link
5. Flick phone — message reveals with animation

## What's New (v1.0.0)
Initial release — send secret messages that friends reveal by flicking their phone. Deliver via push notification or shareable link.

## Review Notes (for Apple reviewer)
Fliq is a messaging app with two delivery modes: push notification and shareable link. To test:

1. Open the app and complete onboarding (enter any name and phone number)
2. Enable push notifications when prompted
3. Tap the + button to create a message
4. **Push to Phone mode:** Enter a recipient phone number and tap "Send Secret" — if the recipient has the app installed, they receive a push notification
5. **Share Link mode:** Toggle to "Share Link", tap "Share Secret" — the share sheet opens with a link you can copy
6. Paste a copied link in Safari to test the link-based receive flow
7. In the app, reveal a received message by shaking/flicking the device

Push notifications require a physical device (not available in Simulator). The push backend server handles message delivery and deletes messages from the server after they are read by the recipient (24-hour TTL). The optional LinkForty integration (in Settings) connects to our analytics platform but is not required for core functionality.
