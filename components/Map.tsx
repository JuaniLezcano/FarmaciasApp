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
import useFetchRoute from "../hooks/useRoutes"; 

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;

interface FarmMapProps {
  farms: Array<{ id: string; name: string; latitude: number; longitude: number }>;
}

export default function FarmMap({ farms }: FarmMapProps) {
  const [location, setLocation] = useState<LocationType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { routeCoordinates, selectedFarm, fetchRoute, clearRoute } = useFetchRoute();

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
            onPress={clearRoute}
          >
            {farms.map((farm) => (
              <Marker
                key={`Farmacia-${farm.id}`}
                coordinate={{
                  latitude: farm.latitude,
                  longitude: farm.longitude,
                }}
                title={farm.name}
                onPress={() => fetchRoute(
                  { latitude: location.latitude, longitude: location.longitude },
                  farm
                )}
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
