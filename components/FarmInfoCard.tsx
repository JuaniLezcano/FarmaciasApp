import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { FarmsContext } from "../context/farmContext";

type FarmInfoCardProps = {
  farmId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
};

const FarmInfoCard: React.FC<FarmInfoCardProps> = ({
  farmId,
  name,
  latitude,
  longitude,
  address,
  phone,
}) => {
  // Acceder al contexto
  const farmsContext = useContext(FarmsContext);

  if (!farmsContext) {
    return null; // Si el contexto no está disponible, retorna null o muestra algún error.
  }

  const { showDirections, selectedFarm, setSelectedFarm, setShowDirections } = farmsContext;

  // Función para llamar a la farmacia
  const callFarm = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      alert("Teléfono no disponible.");
    }
  };

  // Función para abrir la ubicación en un mapa
  const navigateToFarm = () => {
    console.log("Navigate to farm");
    console.log(showDirections)
    console.log(selectedFarm)
    setShowDirections(true); // Activa la lógica de rutas
    console.log(showDirections)
    console.log(selectedFarm)
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.phone}>{phone}</Text>

        <View style={styles.buttonsContainer}>
          {/* Botón para llamar */}
          <TouchableOpacity style={styles.buttonCall} onPress={callFarm}>
            <Text style={styles.buttonText}>Llamar</Text>
          </TouchableOpacity>

          {/* Botón para navegar */}
          <TouchableOpacity
            style={styles.buttonNavigate}
            onPress={() => {
              setSelectedFarm({
                id: farmId,
                name,
                latitude,
                longitude,
                distancia: 0,
              });
              navigateToFarm();
            }}
          >
            <Text style={styles.buttonText}>Ir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCall: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  buttonNavigate: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default FarmInfoCard;
