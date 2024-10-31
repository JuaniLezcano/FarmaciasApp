import { StyleSheet } from 'react-native';
import FarmMap from '../../components/Map';
import { useEffect, useState } from 'react';
import { Text } from '@/components/Themed';
import { fetchNearbyFarms } from '../../hooks/useFarms'; // Importar la función del servicio
import * as Location from 'expo-location';

export default function HomeScreen() {
    const [nearbyFarms, setNearbyFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener las farmacias cercanas
    const getNearbyFarms = async () => {
        try {
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const userLatitude = currentLocation.coords.latitude;
            const userLongitude = currentLocation.coords.longitude;
            
            const farms = await fetchNearbyFarms(userLatitude, userLongitude); // Llama a la función del servicio
            setNearbyFarms(farms);
        } catch (error) {
            setError("No se pudo obtener las farmacias cercanas");
        } finally {
            setLoading(false);
        }
    };

    // Llama a la función cuando el componente se monta
    useEffect(() => {
        getNearbyFarms();
    }, []);

    // Renderiza el mapa o muestra un mensaje de carga/error
    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <FarmMap farms={nearbyFarms} />
    );
}