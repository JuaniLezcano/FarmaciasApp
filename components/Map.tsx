// FarmMap.js
import { useContext } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import useFetchRoute from "../hooks/useRoutes";
import { FarmsContext } from "../context/farmContext";

export default function FarmMap() {
  const farmsContext = useContext(FarmsContext);
  const { farms, userLocation, loading, error } = farmsContext || {};
  const { routeCoordinates, selectedFarm, fetchRoute, clearRoute } = useFetchRoute();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView>
      <View style={styles.mapContainer}>
        {error ? (
          <Text>{error}</Text>
        ) : userLocation ? (
          <MapView
            style={styles.map}
            region={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            onPress={clearRoute}
          >
            {farms && farms.map((farm) => (
              <Marker
                key={`Farmacia-${farm.id}`}
                coordinate={{
                  latitude: farm.latitude,
                  longitude: farm.longitude,
                }}
                title={farm.name}
                onPress={() => fetchRoute(
                  { latitude: userLocation.latitude, longitude: userLocation.longitude },
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
