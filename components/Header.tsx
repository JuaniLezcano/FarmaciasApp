import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar  } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import CSVUploader from './CSVUploader';

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF" // El color de fondo de la barra de estado.
      />
      <View style={styles.header}>
        <FontAwesome name="plus-square" size={24} color={Colors.primary} style={styles.iconLeft} />
        <Text style={styles.title}>Farmacias cercanas</Text>
        <CSVUploader/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',       // Alinea elementos en fila
    justifyContent: 'space-between', // Espacio entre los iconos y el título
    alignItems: 'center',       // Centra verticalmente el contenido
    paddingHorizontal: 16,      // Espacio a los lados
  },
  title: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: 10,            // Espacio entre el icono y el título
  },
});

export default Header;