import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;

type FarmPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
};

interface FarmMapProps {
  farms: FarmPoint[];
}

export default function FarmMap({ farms }: FarmMapProps) {
  const [location, setLocation] = useState<LocationType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [selectedFarm, setSelectedFarm] = useState<FarmPoint | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const userLatitude = currentLocation.coords.latitude;
        const userLongitude = currentLocation.coords.longitude;

        setLocation({
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error obteniendo la ubicación:", error);
        setError("Error obteniendo la ubicación");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Función para obtener la ruta al hacer clic en una farmacia
  const fetchRoute = async (farm: FarmPoint) => {
    if (!location) return;

    console.log("Fetching route...");
    setSelectedFarm(farm); // Actualiza la farmacia seleccionada
    try {
      const response = await fetch(`http://10.10.17.238:3000/get-directions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          destination: { latitude: farm.latitude, longitude: farm.longitude },
        }),
      });

      const data = await response.json();
      const coordinates = data.route.map(
        (point: { lat: number; lng: number }) => ({
          latitude: point.lat,
          longitude: point.lng,
        })
      );

      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Función para deseleccionar la farmacia y ocultar la ruta
  const clearRoute = () => {
    setSelectedFarm(null);
    setRouteCoordinates([]);
  };

  return (
    <ScrollView>
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text>{error}</Text>
        ) : location ? (
          <MapView
            style={styles.map}
            region={location}
            showsUserLocation={true}
            onPress={clearRoute} // Llama a clearRoute al hacer clic fuera de una farmacia
          >
            {farms.map((farm) => (
              <Marker
                key={`Farmacia-${farm.id}`}
                coordinate={{
                  latitude: farm.latitude,
                  longitude: farm.longitude,
                }}
                title={farm.name}
                onPress={() => fetchRoute(farm)} // Llama a fetchRoute al hacer clic en la farmacia
              />
            ))}

            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#0000FF"
                strokeWidth={4}
              />
            )}
          </MapView>
        ) : (
          <Text>No se pudo obtener la ubicación</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 600,
  },
  map: {
    flex: 1,
    height: "100%",
  },
});
