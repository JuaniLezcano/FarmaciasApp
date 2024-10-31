import { StyleSheet, Button, View } from "react-native";
import FarmMap from "../../components/Map";
import { useContext, useState } from "react";
import { Text } from "@/components/Themed";
import { FarmsContext } from "../../context/farmContext";

export default function HomeScreen() {
  const context = useContext(FarmsContext);

  if (!context) {
    throw new Error("FarmsContext debe estar dentro de un FarmsProvider");
  }

  const { farms, loading, error, visibleFarms, setVisibleFarms } = context;
  const [showAll, setShowAll] = useState(false);

  // Actualiza visibleFarms después de actualizar showAll
  const toggleShowAll = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    setVisibleFarms(newShowAll ? farms : farms.slice(0, 5));
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FarmMap farms={visibleFarms} />
      <Button
        title={showAll ? "Mostrar menos" : "Mostrar todas"}
        onPress={toggleShowAll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
