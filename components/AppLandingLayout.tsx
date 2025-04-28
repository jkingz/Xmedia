import { useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

const AppLandingLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthScreen = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthScreen) router.replace('/(auth)/login');
    else if (isSignedIn && inAuthScreen) router.replace('/(tabs)');
  }, [isLoaded, isSignedIn, segments, router]);

  return <Slot />;
};

export default AppLandingLayout;
