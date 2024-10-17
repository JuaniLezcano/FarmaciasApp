import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';

const pharmacies = [
  { id: '1', name: 'Farmacia Central', distance: '2 km' },
  { id: '2', name: 'Farmacia del Pueblo', distance: '3.5 km' },
  { id: '3', name: 'Farmacia San Juan', distance: '1.2 km' },
  { id: '4', name: 'Farmacia La Salud', distance: '4 km' },
  { id: '5', name: 'Farmacia Moderna', distance: '2.8 km' },
];


export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
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
    width: '100%', // El contenedor de cada ítem debe ocupar el ancho completo
    alignItems: 'center', // Centra los ítems dentro del contenedor
  },
  item: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '90%', // Asegura que todas las tarjetas tengan el mismo ancho
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
    width: '90%', // El separador también debe tener el mismo ancho que las tarjetas
    backgroundColor: '#eee',
    alignSelf: 'center', // Asegura que el separador esté centrado
    marginVertical: 10, // Espacio entre los ítems
  },
});
