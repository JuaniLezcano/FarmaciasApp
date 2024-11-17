import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location";
import { fetchFarms } from "../hooks/useFarms";
import LoadingScreen from "../components/LoadingScreen";

interface Farm {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distancia: number;
  address?: string;
  phone?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface FarmsContextType {
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
  displayedFarms: Farm[];
  setDisplayedFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
  visibleFarms: Farm[];
  setVisibleFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
  userLocation: UserLocation | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFarm: Farm | null;
  setSelectedFarm: (farm: Farm | null) => void;
  getNearbyFarms: (farms: Farm[] | undefined) => void;
  showDirections: boolean;
  setShowDirections: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FarmsProviderProps {
  children: ReactNode;
}

export const FarmsContext = createContext<FarmsContextType | null>(null);

export function FarmsProvider({ children }: FarmsProviderProps) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [displayedFarms, setDisplayedFarms] = useState<Farm[]>([]);
  const [visibleFarms, setVisibleFarms] = useState<Farm[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showDirections, setShowDirections] = useState<boolean>(false);

  const getNearbyFarms = async (farms?: Farm[]) => {
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

      let fetchedFarms
      if (farms) {
        fetchedFarms = farms;
      }
      else {
        fetchedFarms = await fetchFarms(latitude, longitude);
      }

      console.log(fetchedFarms);

      const farmsWithDistance = fetchedFarms.map((farm: Farm) => ({
        ...farm,
        distancia: calculateDistance(
          latitude,
          longitude,
          farm.latitude,
          farm.longitude
        ),
      }));
      // Ordenar las farmacias por distancia
      farmsWithDistance.sort((a: Farm, b: Farm) => a.distancia - b.distancia);
      
      setFarms(farmsWithDistance);
      setDisplayedFarms(farmsWithDistance.slice(0, 5));
      setVisibleFarms(farmsWithDistance.slice(0, 5));
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
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  useEffect(() => {
    getNearbyFarms();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FarmsContext.Provider
      value={{
        farms,
        setFarms,
        displayedFarms,
        setDisplayedFarms,
        visibleFarms,
        setVisibleFarms,
        userLocation,
        loading,
        setLoading,
        error,
        setError,
        selectedFarm,
        setSelectedFarm,
        getNearbyFarms
        showDirections,
        setShowDirections,
      }}
    >
      {children}
    </FarmsContext.Provider>
  );
}
