"use client";

import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface MapProps {
  center: { lat: number; lng: number };
  markers?: { lat: number; lng: number }[];
}

const containerStyle = {
  width: "100%", 
  height: "91.2vh",
};

const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMapsComponent: React.FC<MapProps> = ({ center, markers = [] }) => {
  return (
    <LoadScript googleMapsApiKey={apikey!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsComponent;
