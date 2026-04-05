# Mobile Setup

## Development (Expo Go)

The fastest way to test the app on your phone:

1. Install **Expo Go** from the [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Start the dev server:
   ```bash
   cd mobile
   npm install     # first time only
   npx expo start --lan
   ```
3. Scan the QR code with Expo Go
4. Open **Settings** tab and enter your backend URL:
   - **Helm/k3s**: `https://<hostname>/studio` (your ingress hostname)
   - **Local dev**: `http://192.168.x.x:3000` (your PC's LAN IP)
5. Tap **Test Connection** — should show green

::: tip Finding Your IP
Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux). Use the **Wi-Fi adapter's IPv4 address**. Your phone must be on the same Wi-Fi network.
:::

## APK Install

For a standalone app that doesn't need Expo Go:

1. Download the latest APK from the [EAS build page](https://expo.dev/accounts/xander-rudolph/projects/videoideas-studio)
2. Transfer to your phone and install (allow "Unknown sources" in Android settings)
3. Open the app, go to **Settings**, configure your server URL

### Building Your Own APK

```bash
cd mobile
npx eas-cli login          # Expo account required
npx eas build --platform android --profile preview --non-interactive
```

The APK downloads from Expo's cloud build servers.

## Server Connection

The mobile app connects to the same Express backend as the web app:

- **Helm/k3s**: Use your ingress hostname (e.g. `https://craft.example.com/studio`) — accessible from anywhere on your network
- **Local dev**: Both must be on the same network (or use a VPN like Tailscale); use `http://192.168.x.x:3000`
- The server URL is saved and persists between app launches

::: warning HTTP on Android
Android blocks cleartext HTTP by default. The app uses `expo-build-properties` with `usesCleartextTraffic: true` to allow local network HTTP connections.
:::
