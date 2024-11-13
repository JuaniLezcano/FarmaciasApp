import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Alert } from "react-native";
import Colors from '../constants/Colors';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import * as DocumentPicker from 'expo-document-picker';

const CSVUploader = () => {
    const handleFileUpload = async () => {
        try {
            // Abre el selector de archivos y limita a archivos CSV
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values', 'text/plain'],
            });

            // Verifica que el usuario no haya cancelado la selección
            if (!result.canceled) {
                const fileUri = result.assets[0].uri;

                // Lee el contenido del archivo CSV
                const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });

                // Usa PapaParse para analizar el CSV
                const parsedData = Papa.parse(fileContent, { header: true });

                // Verifica que parsedData.meta.fields esté definido antes de acceder a él
                const headers = parsedData.meta?.fields || []; // Usa un arreglo vacío como valor por defecto

                // Comprueba que tenga las columnas requeridas
                const requiredColumns = ['nombre', 'latitud', 'longitud'];
                const hasRequiredColumns = requiredColumns.every(column => headers.includes(column));

                if (hasRequiredColumns) {
                    console.log("El archivo tiene las columnas requeridas.");
                    console.log("Contenido del archivo:", parsedData.data); // Muestra los datos en consola
                    Alert.alert("Archivo válido", `El archivo contiene las columnas necesarias.`);
                } else {
                    console.warn("El archivo no tiene todas las columnas requeridas.");
                    Alert.alert("Archivo inválido", "El archivo no contiene las columnas necesarias (nombre, latitud, longitud).");
                }
            } else {
                Alert.alert("Selección cancelada", "No se seleccionó ningún archivo.");
            }
        } catch (error) {
            console.error("Error al cargar el archivo:", error);
            Alert.alert("Error", "No se pudo cargar el archivo CSV.");
        }
    };

    return (
        <Pressable onPress={handleFileUpload}>
            <FontAwesome name="file" size={24} color={Colors.primary} style={styles.icon} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    icon: {
        marginRight: 10,
    },
});

export default CSVUploader;