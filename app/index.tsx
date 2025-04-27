import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const Index = () => {
  return (
    <View>
      <Redirect href="/(auth)/login" />
    </View>
  );
};

export default Index;
