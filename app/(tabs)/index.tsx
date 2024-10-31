import { StyleSheet, Button, View } from "react-native";
import FarmMap from "../../components/Map";
import { useEffect, useContext, useState } from "react";
import { Text } from "@/components/Themed";
import { fetchFarms } from "../../hooks/useFarms";
import * as Location from "expo-location";
import { FarmsContext } from "../../context/farmContext";

export default function HomeScreen() {
  const context = useContext(FarmsContext);

  if (!context) {
    throw new Error("FarmsContext debe estar dentro de un FarmsProvider");
  }

  const { farms, setFarms, loading, setLoading, error, setError } = context;
  const [showAll, setShowAll] = useState(false); // Estado para alternar entre 5 y todas

  // Función para obtener las farmacias cercanas
  const getNearbyFarms = async () => {
    try {
      console.log("Solicitando permisos...");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        setLoading(false);
        return;
      }

      console.log("Permisos concedidos, obteniendo ubicación...");
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      console.log("Ubicación obtenida:", currentLocation);

      const userLatitude = currentLocation.coords.latitude;
      const userLongitude = currentLocation.coords.longitude;

      console.log("Obteniendo farmacias cercanas...");
      const fetchedFarms = await fetchFarms(
        userLatitude,
        userLongitude,
        showAll ? undefined : 5 // Mostrar todas o solo 5
      );

      setFarms(fetchedFarms);
    } catch (error) {
      console.log("Error en getNearbyFarms:", error);
      setError("No se pudo obtener las farmacias cercanas");
    } finally {
      setLoading(false);
    }
  };

  // Llama a la función cuando el componente se monta o cuando showAll cambia
  useEffect(() => {
    getNearbyFarms();
  }, [showAll]);

  // Renderiza el mapa o muestra un mensaje de carga/error
  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FarmMap farms={farms} />
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
