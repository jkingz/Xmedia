import { useAuth } from '@clerk/clerk-expo';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="mx-auto">
      <TouchableOpacity  className="color-white" onPress={() => signOut()}>
        <Text className="font-bold my-2 mx-2 text-xl border border-red-400 rounded-xl ">SignOut</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
