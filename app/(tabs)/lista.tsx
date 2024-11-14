import React, { useContext } from "react";
import { StyleSheet, FlatList, Text, Pressable, View } from "react-native";
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

  const { visibleFarms } = farmsContext;

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={visibleFarms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Pressable
              onPress={() => {
                farmsContext.setSelectedFarm(item); // Guarda la farmacia seleccionada en el contexto
                router.navigate("./"); // Navega a HomeScreen
              }}
              style={({ pressed }) => [
                styles.item,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text style={styles.distance}>{item.distancia} m</Text>
            </Pressable>
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
    backgroundColor: "#f7f7f7",
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  item: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 180, // Tamaño fijo
    height: 100, // Tamaño fijo
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  distance: {
    fontSize: 14,
    color: "#777",
  },
  separator: {
    height: 1,
    width: "90%",
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginVertical: 15,
  },
});
