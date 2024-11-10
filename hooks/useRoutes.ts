import useIp from "./useIp";
import { useState } from "react";

// Define los tipos de datos dentro del hook
type Coordinate = {
  latitude: number;
  longitude: number;
};

type FarmPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
};

export default function useFetchRoute() {
  const { ip } = useIp();
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<FarmPoint | null>(null);

  const fetchRoute = async (origin: Coordinate, farm: FarmPoint) => {
    if (!origin) return;

    setSelectedFarm(farm);
    try {
      const response = await fetch(`http://${ip}:3000/get-directions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin,
          destination: { latitude: farm.latitude, longitude: farm.longitude },
        }),
      });

      const data = await response.json();
      const coordinates = data.route.map((point: { lat: number; lng: number }) => ({
        latitude: point.lat,
        longitude: point.lng,
      }));

      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const clearRoute = () => {
    setSelectedFarm(null);
    setRouteCoordinates([]);
  };

  return { routeCoordinates, selectedFarm, fetchRoute, clearRoute };
}
