import axios from "axios";

export const calculateRoute = async (origin: string, destination: string) => {
  const apikey = process.env.GOOGLE_MAPS_API_KEY;
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: apikey,
      },
    });

    const route = response.data.routes[0];
    if (!route) return null;

    const { distance, duration, start_location, end_location } = route.legs[0];

    return {
      distance: distance.value, 
      duration: duration.value, 
      originCoordinates: { lat: start_location.lat, lng: start_location.lng },
      destinationCoordinates: { lat: end_location.lat, lng: end_location.lng },
    };
  } catch (error) {
    console.error("Erro ao calcular rota", error);
    return null;
  }
};
