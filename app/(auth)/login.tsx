import COLORS from '@/constants/theme';
import { styles } from '@/styles/auth.styles';
import { useSSO } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    console.log('Google sign in initiated');
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="h-full w-full flex-grow-0 items-center bg-black py-20">
      <View className="flex items-center">
        <View>
          <Ionicons name="diamond" size={42} color={COLORS.primary}></Ionicons>
        </View>
        <Text className="text-green-500 font-medium text-2xl py-2">Login</Text>
        <Text className="text-green-500 font-medium text-xl">
          Welcome to Xmedia
        </Text>
      </View>
      <View className="pt-20">
        <Image
          className="object-cover w-96 h-96"
          source={require('../../assets/images/Mobile-bro.png')}
          resizeMode="cover"
        ></Image>
      </View>
      <View style={styles.loginSection}>
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          style={styles.googleButton}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Sign in with Google"
          accessibilityRole="button"
        >
          <View style={styles.googleIconContainer}>
            <Ionicons
              name="logo-google"
              size={20}
              color={COLORS.surface}
            ></Ionicons>
          </View>
          <Text style={styles.googleButtonText}>Continue with google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
