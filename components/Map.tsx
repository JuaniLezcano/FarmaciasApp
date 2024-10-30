import * as Location from 'expo-location';
import { useState, useEffect } from "react";
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from 'react-native';

type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
} | null;

type FarmPoint = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

export default function FarmMap() {
    const [location, setLocation] = useState<LocationType>(null);
    const [loading, setLoading] = useState(true);
    const [nearbyFarms, setNearbyFarms] = useState<FarmPoint[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchNearbyFarms = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`http://192.168.1.97:3000/farmacias-cercanas?lat=${lat}&lon=${lon}`);
            if (!response.ok) {
                throw new Error('Error en la solicitud al servidor');
            }
    
            const data = await response.json();
    
            // Calcular distancia y filtrar las cinco farmacias más cercanas
            const farms = data
            .map((farm: any) => ({
                id: farm.id,
                name: farm.nombre,  // Mapear 'nombre' a 'name'
                latitude: farm.latitude,
                longitude: farm.longitude,
                distance: Math.sqrt(
                    Math.pow(farm.latitude - lat, 2) + Math.pow(farm.longitude - lon, 2)
                ),
            }))
            .sort((a: FarmPoint & { distance: number }, b: FarmPoint & { distance: number }) => a.distance - b.distance)
            .slice(0, 5);
        
    
            setNearbyFarms(farms);
            console.log(farms)
        } catch (error) {
            console.error("Error fetching nearby farms:", error);
            setError("No se pudo obtener las farmacias cercanas");
        }
    };

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

                // Establecer la ubicación del usuario
                setLocation({
                    latitude: userLatitude,
                    longitude: userLongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });

                // Llamar a la función para obtener farmacias cercanas
                await fetchNearbyFarms(userLatitude, userLongitude);
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
                    <MapView style={styles.map} region={location} showsUserLocation={true}>
                        {nearbyFarms.map((farm) => {
                                console.log(`Nombre de la farmacia: ${farm.name}`);
                                return (
                                    <Marker
                                        key={`Farmacia-${farm.id}`}
                                        coordinate={{
                                            latitude: farm.latitude,
                                            longitude: farm.longitude,
                                        }}
                                        title={farm.name}
                                    />
                                );
                        })}
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
        height: 400,
        marginVertical: 16,
    },
    map: {
        flex: 1,
        height: "100%",
    }
});