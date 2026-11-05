# Sidera customer apps

The website (`web/`, Next.js on Vercel) and the app (`mobile/`, Flutter for Android and iOS) are built side by side from one design and one backend contract.

| Shared piece | Source | Used by |
|---|---|---|
| Design tokens (colours, type, radius, spacing, motion) | `packages/tokens/tokens.json` | `web/src/styles/tokens.css`, `mobile/lib/theme/tokens.g.dart` |
| Every user-facing string | `packages/copy/en.json` | `web/src/copy/en.json`, `mobile/assets/copy/en.json` |
| Backend contract | `packages/api/openapi.yaml` | `web/src/lib/api/`, `mobile/lib/api/` |

After changing tokens or copy, regenerate both apps' copies:

```sh
node packages/tokens/build.mjs
```

Screens follow the UX flowchart: login with WhatsApp (reverse OTP), onboarding (same steps as the WhatsApp form), one chat shared with WhatsApp, home with the daily card and birth chart (North or South Indian by birthplace), friends, profile and credits (Razorpay).

Both apps run against an in-memory mock of the API until the `customer-api` Supabase function exists in KundliAI/whatsapp-webhook. The web app switches to the real API when `NEXT_PUBLIC_SIDERA_API` is set.

## Web

```sh
cd apps/web
npm install
npm run dev        # http://localhost:3000
npm test           # rules
npx tsc --noEmit
npm run build
```

On Vercel, create a project from this repo with **Root Directory** `apps/web`.

## Mobile

```sh
cd apps/mobile
flutter pub get
flutter analyze
flutter test
flutter run                   # device or emulator
flutter run -d chrome --web-browser-flag=--window-size=390,844   # quick preview
```

Preview links for the web build: `?demo=1&tab=0..3` opens signed in on a tab, `?demo=onboarding` opens mid-way through onboarding. They only exist while the mock API is in use.
