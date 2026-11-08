# SpoteraDeals native app preparation

This is a Capacitor 7 scaffold, **not a certified store-ready release**. The existing React/Vite app and Vercel API remain unchanged.

## Prerequisites
- Node.js supported by root package.json and working npm registry access.
- Android Studio and Android SDK for Android; macOS and Xcode for iOS.
- Developer accounts for eventual store submissions.

## Build and test
From the repository root:

```sh
npm ci
npm run lint
npm test
npm run build:web
cd mobile
npm install
npx cap add android
# macOS only: npx cap add ios
npm run sync
npm run doctor
npm run android
# macOS only: npm run ios
```

Never commit signing keys, secrets, or provisioning profiles.

## Blocking work before submission
- The app currently uses relative `/api/*` routes; native WebViews require a reviewed HTTPS API base URL and secure cross-origin authentication/session design.
- Verify login/register/guest, admin/merchant/customer role permissions, deep links, password recovery, QR camera permissions, booking, points refunds, checkout return, RTL, and responsiveness on physical devices.
- Keep payments disabled pending licensing, payment provider setup, and legal review.
- Finalize app ID, legal entity, privacy policy, account deletion, screenshots, ratings, and store listings.
- Confirm app-store policy compliance; a PWA or website wrapper alone does not establish approval.
