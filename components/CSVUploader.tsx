import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Alert } from "react-native";
import Colors from '../constants/Colors';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import * as DocumentPicker from 'expo-document-picker';
import { useContext } from "react";
import { FarmsContext } from "../context/farmContext";

interface CSVRow {
    nombre: string;
    latitud: string;
    longitud: string;
}

const CSVUploader = () => {
    const context = useContext(FarmsContext);

    if (!context) {
        throw new Error("FarmsContext debe usarse dentro de un FarmsProvider");
    }

    const { setFarms, setDisplayedFarms, setVisibleFarms } = context;

    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values', 'text/plain'],
            });

            if (!result.canceled) {
                const fileUri = result.assets[0].uri;
                const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });

                const parsedData = Papa.parse<CSVRow>(fileContent, { header: true });
                const headers = parsedData.meta?.fields || [];

                const requiredColumns = ['nombre', 'latitud', 'longitud', 'distancia', 'telefono'];
                const hasRequiredColumns = requiredColumns.every(column => headers.includes(column));

                if (hasRequiredColumns) {
                    const newFarms = parsedData.data.map((row, index) => ({
                        id: index.toString(),
                        name: row.nombre,
                        latitude: parseFloat(row.latitud),
                        longitude: parseFloat(row.longitud),
                        distancia: 0,
                    }));

                    context.getNearbyFarms(newFarms);

                    Alert.alert("Archivo válido", "El archivo contiene las columnas necesarias.");
                } else {
                    Alert.alert("Archivo inválido", "El archivo no contiene las columnas necesarias (nombre, latitud, longitud).");
                }
            } else {
                Alert.alert("Selección cancelada", "No se seleccionó ningún archivo.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo cargar el archivo CSV.");
        }
    };

    return (
        <Pressable onPress={handleFileUpload}>
            <FontAwesome name="file" size={24} color={Colors.primary} style={styles.icon} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginRight: 10,
    },
});

export default CSVUploader;
