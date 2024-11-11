import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Pressable, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '../constants/Colors';

const Header = () => {
  // Función para manejar la carga del archivo CSV
  const handleFileUpload = async () => {
    try {
      // Abre el selector de archivos y limita a archivos CSV
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values', 'text/plain'], // Diferentes tipos MIME para archivos CSV
      });

      // Verifica que el usuario no haya cancelado la selección
      console.log(result);

      if (result.canceled === false) {
        Alert.alert("Archivo seleccionado", `Nombre del archivo: ${result.assets[0].name}`);
        // Aquí podrías procesar el archivo si es necesario
      } else {
        Alert.alert("Selección cancelada", "No se seleccionó ningún archivo.");
      }
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
      Alert.alert("Error", "No se pudo cargar el archivo CSV.");
    }
  };

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
        <Pressable onPress={handleFileUpload}>
          <FontAwesome name="file" size={24} color={Colors.primary} style={styles.iconRight} />
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
