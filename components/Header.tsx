import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar } from 'react-native';
import Colors from '../constants/Colors';

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content" // Ajusta a 'light-content' si prefieres un texto de la barra de estado claro.
        backgroundColor="#FFFFFF" // El color de fondo de la barra de estado
      />
      <View style={styles.header}>
        <Text style={styles.title}>Farmacias cercanas</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 70,
    justifyContent: 'center',   // Centra el contenido verticalmente
    alignItems: 'center',       // Centra el contenido horizontalmente
  },
  title: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: 'bold',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
});

export default Header;