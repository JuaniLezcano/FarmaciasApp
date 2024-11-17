import * as Location from "expo-location";
import { useState, useEffect, useContext } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import MapViewDirections from "react-native-maps-directions";
import useFetchRoute from "../hooks/useRoutes";
import { FarmsContext } from "../context/farmContext";
import FarmInfoCard from "../components/FarmInfoCard"; // Importa la card

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;

type RouteStep = {
  instruction: string;
  latitude: number;
  longitude: number;
};

interface FarmMapProps {
  farms: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    distancia: number;
    address?: string;
    phone?: string;
  }>;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyAhF_BSG-vy6lkSGWHKFxBPBQpol2SNlwA";

export default function FarmMap({ farms }: FarmMapProps) {
  const [location, setLocation] = useState<LocationType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { routeCoordinates, fetchRoute, clearRoute } = useFetchRoute();

  const farmContext = useContext(FarmsContext);

  if (!farmContext) {
    throw new Error("FarmsContext must be used within a FarmsProvider");
  }

  const { selectedFarm, setSelectedFarm } = farmContext;
  const [showDirections, setShowDirections] = useState(false);

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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : location ? (
        <>
          <MapView
            style={styles.map}
            region={location}
            showsUserLocation={true}
            toolbarEnabled={false}
            onPress={() => {
              setSelectedFarm(null);
              clearRoute();
            }}
          >
            {farms.map((farm) => (
              <Marker
                key={`Farmacia-${farm.id}`}
                coordinate={{
                  latitude: farm.latitude,
                  longitude: farm.longitude,
                }}
                title={farm.name}
                onPress={() => {
                  setSelectedFarm(farm);
                  fetchRoute(
                    {
                      latitude: location.latitude,
                      longitude: location.longitude,
                    },
                    farm
                  );
                }}
              />
            ))}

            {selectedFarm && showDirections && (
              <MapViewDirections
                origin={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                destination={{
                  latitude: selectedFarm.latitude,
                  longitude: selectedFarm.longitude,
                }}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeColor="red"
                strokeWidth={4}
                onReady={(result) => {
                  const newRouteCoordinates = result.coordinates.map(
                    (coord, index) => ({
                      instruction: `Paso ${index + 1}`, // Puedes reemplazar con instrucciones reales si están disponibles
                      latitude: coord.latitude,
                      longitude: coord.longitude,
                    })
                  );
                  // Actualiza las coordenadas de la ruta en el contexto
                  fetchRoute(
                    {
                      latitude: location.latitude,
                      longitude: location.longitude,
                    },
                    selectedFarm
                  );
                }}
                onError={(errorMessage) => {
                  console.error("Error al calcular la ruta:", errorMessage);
                }}
              />
            )}
          </MapView>
          {showDirections && routeCoordinates.length > 0 && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Indicaciones:</Text>
              <ScrollView style={styles.scrollInstructions}>
                {routeCoordinates.map((step, index) => (
                  <Text key={index} style={styles.instructionText}>
                    {index + 1}. {step.instruction}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}

          {selectedFarm && (
            <View style={styles.cardContainer}>
              <FarmInfoCard
                farmId={selectedFarm.id}
                name={selectedFarm.name}
                latitude={selectedFarm.latitude}
                longitude={selectedFarm.longitude}
                address={selectedFarm.address || "Dirección no disponible"}
                phone={selectedFarm.phone || "Teléfono no disponible"}
              />
            </View>
          )}
        </>
      ) : (
        <Text>No se pudo obtener la ubicación</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "#ffffffcc", // Fondo blanco semitransparente
    padding: 10,
    borderRadius: 8,
    maxHeight: 200, // Altura máxima del contenedor
  },
  scrollInstructions: {
    maxHeight: 150, // Limitar altura de la sección desplazable
  },
  instructionsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 3,
  },
  cardContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
});
