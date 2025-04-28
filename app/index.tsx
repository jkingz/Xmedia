import { styles } from '@/styles/auth.styles';
import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const Index = () => {
  return (
    <View style={styles.container}>
      <Redirect href="/(auth)/login" />
    </View>
  );
};

export default Index;
