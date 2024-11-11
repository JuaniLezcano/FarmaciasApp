import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="medical" size={100} color="#4CAF50" />      
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  icon: {
    marginBottom: 20,
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  }
});

export default LoadingScreen;
