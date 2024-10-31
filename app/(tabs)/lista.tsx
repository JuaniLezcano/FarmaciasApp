import React, { useContext } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FarmsContext } from "../../context/farmContext";

export default function ListScreen() {
  const router = useRouter();
  const farmsContext = useContext(FarmsContext);

  if (!farmsContext) {
    return (
      <ThemedText>
        Error: El contexto de farmacias no está disponible
      </ThemedText>
    );
  }

  const { displayedFarms } = farmsContext; // Cambiar farms a displayedFarms

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={displayedFarms} // Cambiar aquí
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => router.navigate("./")}
              style={styles.item}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.distance}>{item.distance} m</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f0f0", // Fondo claro para la vista principal
  },
  listContainer: {
    paddingVertical: 20,
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  item: {
    padding: 15,
    backgroundColor: "#fff", // Fondo blanco para las tarjetas
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000", // Sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5, // Efecto de elevación para Android
  },
  name: {
    fontSize: 16, // Tamaño de fuente ajustado
    fontWeight: "bold",
    color: "#333", // Color de texto más oscuro
  },
  distance: {
    fontSize: 14, // Tamaño de fuente ajustado
    color: "gray",
  },
  separator: {
    height: 1,
    width: "90%",
    backgroundColor: "#eee",
    alignSelf: "center",
    marginVertical: 10,
  },
});
