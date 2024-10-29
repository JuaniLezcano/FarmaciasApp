import React from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { Pharmacy } from "@/constants/types";
import { useRouter } from 'expo-router';

const pharmacies: Pharmacy[] = [
  { id: 1, name: 'Farmacia Central', distance: 2000 },
  { id: 2, name: 'Farmacia del Pueblo', distance: 3500 },
  { id: 3, name: 'Farmacia San Juan', distance: 1200 },
  { id: 4, name: 'Farmacia La Salud', distance: 4000 },
  { id: 5, name: 'Farmacia Moderna', distance: 2800 },
];

export default function ListScreen() {
  const router = useRouter(); // Inicializa el router

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => router.navigate('./')}
              style={styles.item}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.distance}>{item.distance} m</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
        numColumns={2} // Muestra los elementos en dos columnas
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: 20, // Espacio en la parte superior e inferior de la lista
  },
  itemContainer: {
    flex: 1, // Cada elemento toma el 50% del ancho disponible
    padding: 10,
    alignItems: 'center',
  },
  item: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '100%', // Cada tarjeta ocupa el ancho completo de su contenedor
    alignItems: 'center', // Centra el contenido dentro de las tarjetas
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 16,
    color: 'gray',
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: '#eee',
    alignSelf: 'center',
    marginVertical: 10,
  },
});