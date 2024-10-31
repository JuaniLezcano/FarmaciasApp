// farmContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location";
import { fetchFarms } from "../hooks/useFarms";

interface Farm {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface FarmsContextType {
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>; // Agrega esto
  userLocation: UserLocation | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Agrega esto
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>; // Agrega esto
}

interface FarmsProviderProps {
  children: ReactNode;
}

export const FarmsContext = createContext<FarmsContextType | null>(null);

export function FarmsProvider({ children }: FarmsProviderProps) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getNearbyFarms = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      const fetchedFarms = await fetchFarms(latitude, longitude);
      const farmsWithDistance = fetchedFarms.map((farm: Farm) => ({
        ...farm,
        distance: calculateDistance(
          latitude,
          longitude,
          farm.latitude,
          farm.longitude
        ),
      }));
      setFarms(farmsWithDistance);
    } catch (error) {
      setError("No se pudo obtener las farmacias cercanas");
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Devuelve la distancia en metros redondeada
  };

  useEffect(() => {
    getNearbyFarms();
  }, []);

  return (
    <FarmsContext.Provider
      value={{
        farms,
        setFarms,
        userLocation,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </FarmsContext.Provider>
  );
}
