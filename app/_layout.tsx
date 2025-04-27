import AppLandingLayout from '@/components/AppLandingLayout';
import '../global.css';

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import your Publishable Key
const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-green-500">
          <AppLandingLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
