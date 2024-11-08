export const getDirections = async (origin: string, destination: string) => {
  try {
    const response = await fetch(
      `https://10.10.17.238:3000/get-directions?origin=${origin}&destination=${destination}`
    );
    const data = await response.json();
    return data.routes[0].overview_polyline.points; // Obtener la ruta en formato polyline
  } catch (error) {
    console.error("Error fetching directions:", error);
  }
};
