import { StyleSheet, Button, View } from "react-native";
import FarmMap from "../../components/Map";
import { useEffect, useContext, useState } from "react";
import { Text } from "@/components/Themed";
import { FarmsContext } from "../../context/farmContext";

export default function HomeScreen() {
  const context = useContext(FarmsContext);

  if (!context) {
    throw new Error("FarmsContext debe estar dentro de un FarmsProvider");
  }

  const { farms, setFarms, loading, setLoading, error, setError } = context;
  const [showAll, setShowAll] = useState(false); // Estado para alternar entre 5 y todas

  // Almacena la lista que se va a mostrar
  const displayedFarms = showAll ? farms : farms.slice(0, 5); // Muestra todas o solo las 5 más cercanas

  // Renderiza el mapa o muestra un mensaje de carga/error
  if (loading) {
    return <Text>Cargando...</Text>; // Asegúrate de que esto esté en un componente <Text>
  }

  if (error) {
    return <Text>{error}</Text>; // Asegúrate de que esto esté en un componente <Text>
  }

  return (
    <View style={styles.container}>
      <FarmMap farms={displayedFarms} />
      <Button
        title={showAll ? "Mostrar menos" : "Mostrar todas"}
        onPress={() => setShowAll(!showAll)} // Alterna el valor de showAll
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
