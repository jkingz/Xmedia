import AppLandingLayout from '@/components/AppLandingLayout';
import '../global.css';

import CCProviders from '@/providers/CCProviders';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <CCProviders>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-black">
          <AppLandingLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </CCProviders>
  );
}
