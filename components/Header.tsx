import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../constants/Colors';

const Header = () => {
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
        
        {/* Icono de lupa a la derecha */}
        <Pressable onPress={() => console.log("Buscar")}>
          <FontAwesome name="search" size={24} color={Colors.primary} style={styles.iconRight} />
        </Pressable>
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
  iconRight: {
    marginLeft: 10,             // Espacio entre el título y el icono
  },
});

export default Header;
