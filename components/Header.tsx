import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Farmacias cercanas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#FFFFFF', // Cambia el color de fondo
    justifyContent: 'center',   // Centra el contenido verticalmente
    alignItems: 'center',       // Centra el contenido horizontalmente
    paddingTop: 15,
  },
  title: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: 'bold',
  },
});

export default Header;