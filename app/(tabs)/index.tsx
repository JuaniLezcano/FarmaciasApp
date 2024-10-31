import { StyleSheet, Button, View } from 'react-native';
import FarmMap from '../../components/Map';
import { useEffect, useState } from 'react';
import { Text } from '@/components/Themed';
import { fetchFarms } from '../../hooks/useFarms';
import * as Location from 'expo-location';

export default function HomeScreen() {
    const [nearbyFarms, setNearbyFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false); // Estado para alternar entre 5 y todas

    // Función para obtener las farmacias cercanas
    const getNearbyFarms = async () => {
        try {
            setLoading(true);
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const userLatitude = currentLocation.coords.latitude;
            const userLongitude = currentLocation.coords.longitude;
            
            // Llama a fetchFarms con `cant` solo si `showAll` es false
            const farms = showAll 
                ? await fetchFarms(userLatitude, userLongitude) 
                : await fetchFarms(userLatitude, userLongitude, 5);

            setNearbyFarms(farms);
        } catch (error) {
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
            <FarmMap farms={nearbyFarms} />
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
