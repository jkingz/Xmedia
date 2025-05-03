import { tokenCache } from '@/cache';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react';

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL! as string,
  { unsavedChangesWarning: false },
);
// Import your Publishable Key
const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const CCProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default CCProviders;
