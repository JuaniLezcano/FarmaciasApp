export const fetchNearbyFarms = async (lat: number, lon: number) => {
  const apiUrl = `http://192.168.94.153:3000/farmacias-cercanas?lat=${lat}&lon=${lon}&cantidad=${5}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error en la solicitud al servidor");
    }

    const data = await response.json();

    // Mapear los datos recibidos a un formato más manejable
    return data.map((farm: any) => ({
      id: farm.id,
      name: farm.name,
      latitude: farm.latitude,
      longitude: farm.longitude,
    }));
  } catch (error) {
    console.error("Error fetching nearby farms:", error);
    throw error; // Re-lanzar el error para que se maneje en el componente
  }
};
