import useIp from "./useIp";
export const fetchFarms = async (lat: number, lon: number) => {
  const { ip } = useIp();
  // Construir la URL de la API con el parámetro cantidad solo si está presente
  const apiUrl = `http://${ip}:3000/farmacias-abiertas-o-de-turno?lat=${lat}&lon=${lon}`;

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
      distancia: farm.distancia,
      address: farm.direccion,
      phone: farm.telefono,
    }));
  } catch (error) {
    console.error("Error fetching nearby farms:", error);
    throw error; // Re-lanzar el error para que se maneje en el componente
  }
};
