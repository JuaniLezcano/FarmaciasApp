import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Mi Aplicación</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#6200EE', // Cambia el color de fondo
    justifyContent: 'center',   // Centra el contenido verticalmente
    alignItems: 'center',       // Centra el contenido horizontalmente
    paddingTop: 15,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;