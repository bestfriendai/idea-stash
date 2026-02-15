# IdeaStash - Setup & Launch Guide

## Prerequisites

### Required Tools
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS builds)
- Android Studio (for Android builds)
- EAS CLI (`npm install -g eas-cli`)

### Accounts Required
- Apple Developer Account ($99/year)
- Google Play Console ($25 one-time)
- RevenueCat Account (free tier available)
- Expo Account (free)

---

## Installation

```bash
# Navigate to project directory
cd idea-stash

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on Device/Simulator
```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Physical device (requires Expo Go app)
npx expo start
```

---

## RevenueCat Setup

### 1. Create RevenueCat Account
1. Go to [revenuecat.com](https://revenuecat.com)
2. Sign up for free account
3. Create new project: "IdeaStash"

### 2. Configure Products

#### iOS (App Store Connect)
1. Go to App Store Connect → your app → Features → In-App Purchases
2. Create two products:
   - **Monthly Subscription**: Product ID `com.ideastash.premium.monthly`, Price: $4.99
   - **Annual Subscription**: Product ID `com.ideastash.premium.annual`, Price: $39.99

#### Android (Google Play Console)
1. Go to Play Console → Monetize → Products → Subscriptions
2. Create same products with matching IDs

#### RevenueCat Dashboard
1. Products → Add Product
2. Create matching product IDs
3. Set as active

### 3. Get API Keys
1. RevenueCat → Project Settings → API Keys
2. Copy your `public` API key
3. Add to app (see integration below)

### 4. Integration
Replace `src/services/purchases.ts` stub with actual RevenueCat SDK:

```bash
npm install react-native-purchases
```

Then update purchases.ts with:
```typescript
import Purchases from 'react-native-purchases';

const API_KEY = 'your_public_api_key';

export async function initPurchases() {
  await Purchases.configure({ apiKey: API_KEY });
}
```

---

## App Store Connect Setup

### 1. Create App
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → + → New App
3. Fill in:
   - Name: IdeaStash
   - Bundle ID: com.ideastash.app
   - Platform: iOS

### 2. App Information
- **Category**: Productivity
- **Content Rights**: No
- **Age Rating**: 4+

### 3. Upload Build
```bash
# Create iOS build
eas build -p ios --profile production

# Or locally with Xcode
npx expo run:ios
```

### 4. Submit for Review
- Screenshots: 6.7" and 5.5" required
- Description: See `aso/description.md`
- Keywords: See `aso/keywords.txt`

---

## Google Play Setup

### 1. Create App
1. Go to [Play Console](https://play.google.com/console)
2. Apps → Create App
3. Name: IdeaStash
4. Package name: com.ideastash.app

### 2. Upload Build
```bash
# Create Android build
eas build -p android --profile production

# Or locally
npx expo run:android
```

### 3. Store Listing
- Short description: See `aso/subtitle.txt`
- Full description: See `aso/description.md`
- Screenshots: Phone and tablet

---

## EAS Build Commands

### Development Build
```bash
# Interactive setup
eas build:configure

# Build for development
eas build -p ios --profile development
```

### Production Build (App Store)
```bash
# iOS Production
eas build -p ios --profile production

# Android Production
eas build -p android --profile production

# Submit to Apple
eas submit -p ios

# Submit to Google
eas submit -p android
```

### Build Profiles
- **development**: For testing on physical devices
- **preview**: For TestFlight/Internal Testing
- **production**: For App Store/Play Store release

---

## Submission Checklist

### Pre-Submission
- [ ] RevenueCat products created and active
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots (6.7", 5.5", iPad)
- [ ] Privacy Policy URL
- [ ] Support URL
- [ ] Version number updated

### App Store
- [ ] Bundle ID registered
- [ ] In-App Purchases configured
- [ ] Build uploaded via EAS
- [ ] App Information completed
- [ ] Pricing and Availability set

### Play Store
- [ ] Package name registered
- [ ] App signing configured
- [ ] Build uploaded via EAS
- [ ] Store listing completed
- [ ] Pricing set

### Testing
- [ ] Test purchase flow (use Sandbox)
- [ ] Test restore purchases
- [ ] Test on physical device
- [ ] Test all navigation flows
- [ ] Test empty states

---

## Common Issues

### Build Errors
- **Module not found**: Run `npm install`
- **TypeScript errors**: Check `tsconfig.json`
- **Pod install failed**: Try `cd ios && pod install`

### RevenueCat Issues
- **Products not found**: Check product IDs match exactly
- **Purchases fail**: Ensure sandbox accounts configured
- **Entitlements not active**: Check RevenueCat dashboard

### App Store Rejection
- **Missing privacy policy**: Add to App Information
- **Crash on launch**: Test on physical device
- **In-app purchase issues**: Ensure sandbox tester configured

---

## Support

- Expo Docs: https://docs.expo.dev
- RevenueCat Docs: https://docs.revenuecat.com
- EAS CLI: https://github.com/expo/eas-cli
