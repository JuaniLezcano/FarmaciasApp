import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar  } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import CSVUploader from './CSVUploader';

const Header = () => {
  // Función para manejar la carga del archivo CSV
  
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content" // Cambia a 'light-content' si prefieres texto claro en la barra de estado.
        backgroundColor="#FFFFFF" // El color de fondo de la barra de estado.
      />
      <View style={styles.header}>
        {/* Icono de cruz de farmacia a la izquierda */}
        <FontAwesome name="plus-square" size={24} color={Colors.primary} style={styles.iconLeft} />

        {/* Título */}
        <Text style={styles.title}>Farmacias cercanas</Text>

        {/* Icono de archivo a la derecha */}
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