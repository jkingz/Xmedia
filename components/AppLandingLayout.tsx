import { useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';

const AppLandingLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoaded) return;
    const isAuthScreen = segments[0] === '(auth)';
    if (!isSignedIn && !isAuthScreen) router.replace('/(auth)/login');
    else if (isSignedIn && isAuthScreen) router.replace('/(tabs)');
  }, [isLoaded, segments, isSignedIn]);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};

export default AppLandingLayout;
