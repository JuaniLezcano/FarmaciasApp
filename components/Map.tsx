import * as Location from 'expo-location';
import { useState, useEffect, useRef } from "react";
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

    // Estado para gestionar el estado de carga
    const [loading, setLoading] = useState(true);

    // Estado para almacenar los restaurantes cercanos al usuario
    const [nearbyFarms, setNearbyFarms] = useState<FarmPoint[]>([]);
    // Al momento de realizar una llamada a la API de Google Places te retorna una lista de restaurantes (en este caso) y si hay más de cierta cantidad
    // Entonces lo que hace google es usar un token para mostrarlos en una página siguiente
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);

    const additionalFarms: FarmPoint[] = [
        {
            id: 1,
            name: "Farmacia1",
            latitude: -34.9138048884854,
            longitude: -57.94808435414168,
        },
        {
            id: 2,
            name: "Farmacia2",
            latitude: -34.91801012714514,
            longitude: -57.95458602885797,
        },
        {
            id: 3,
            name: "Farmacia3",
            latitude: -34.91575797594942,
            longitude: -57.95510101289757,
        },
        {
            id: 4,
            name: "Farmacia4",
            latitude: -34.91081037947414,
            longitude: -57.94575454132004,
        },
        {
            id: 5,
            name: "Farmacia5",
            latitude: -34.90639681023369,
            longitude: -57.924194197557235,
        },
    ];

    const haversine = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Diferencia de latitud en radianes
        const dLon = (lon2 - lon1) * (Math.PI / 180); // Diferencia de longitud en radianes
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2); // Fórmula de Haversine
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Arco entre los puntos
        return R * c; // Distancia en kilómetros
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
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
                    latitudeDelta: 0.0922, // Zoom inicial en el mapa
                    longitudeDelta: 0.0421,
                });

            } catch (error) {
                console.error("Error obteniendo la ubicación:", error);
            } finally {
                setLoading(false); // Una vez que se obtienen los datos, se deja de cargar
            }
        })();
    }, []); // Ejecutar el efecto cuando se monta el componente

    return (
        <ScrollView>
            <View style={styles.mapContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : location ? (
                    <MapView style={styles.map} region={location}>
                        {[...nearbyFarms, ...additionalFarms].map(
                            (farm) => (
                                <Marker
                                    key={`Farmacia-${farm.id}`} // Ensure unique keys by prefixing the ID
                                    coordinate={{
                                        latitude: farm.latitude,
                                        longitude: farm.longitude,
                                    }}
                                    title={farm.name}
                                    description="Farmacia de turno"
                                />
                            )
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
        height: 400,
        marginVertical: 16,
    },
    map: {
        flex: 1,
        height: "100%",
    }
})