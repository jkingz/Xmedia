import AppLandingLayout from '@/components/AppLandingLayout';
import '../global.css';

import CCProviders from '@/providers/CCProviders';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <CCProviders>
      <StatusBar style="light" />
      <SafeAreaProvider>
        <SafeAreaView className='flex-1 bg-black'>
          <AppLandingLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </CCProviders>
  );
}
