import React from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "70vh",
};

interface MapContainerProps {
  directions: any;
}

const MapContainer: React.FC<MapContainerProps> = ({ directions }) => {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: -23.5614744, lng: -46.6565306 }}
      zoom={12}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapContainer;
