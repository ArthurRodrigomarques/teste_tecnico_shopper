"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import api from "@/services/api"; // Importação do serviço API para requisições
import MapContainer from "./MapContainer";
import DriverCard from "./DriverCard";
import DriverDetails from "./DriverDetails";
import ConfirmButton from "./ConfirmButton";

interface Driver {
  driverId: string;
  name: string;
  description: string;
  car: string;
  rating: string;
  totalCost: number;
}

interface MapProps {
  origin: string;
  destination: string;
  customerId: string;
}

const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMapsComponent: React.FC<MapProps> = ({ origin, destination, customerId }) => {
  const [directions, setDirections] = useState<any>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showDrivers, setShowDrivers] = useState(false); 
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await api.post("/ride/estimate", {
          origin,
          destination,
        });

        if (response.data.origin && response.data.destination) {
          const directionsService = new google.maps.DirectionsService();

          directionsService.route(
            {
              origin: {
                lat: response.data.origin.latitude,
                lng: response.data.origin.longitude,
              },
              destination: {
                lat: response.data.destination.latitude,
                lng: response.data.destination.longitude,
              },
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                setDirections(result);
                setDrivers(response.data.drivers);
              } else {
                console.error("Falha ao buscar a rota:", status);
                alert("Não foi possível renderizar a rota no mapa.");
              }
            }
          );
        } else {
          alert("Não foi possível calcular a rota.");
        }
      } catch (error) {
        console.error("Erro ao buscar a rota:", error);
        alert("Erro ao buscar a rota.");
      }
    };

    fetchRoute();
  }, [origin, destination]);

  const handleConfirm = async () => {
    if (!selectedDriver) {
      alert("Selecione um motorista antes de confirmar.");
      return;
    }

    try {
      const response = await api.patch("/ride/confirm", {
        customerId,
        origin,
        destination,
        driver: {
          id: selectedDriver.driverId,
          name: selectedDriver.name,
        },
      });

      if (response.status === 200) {
        alert(`Viagem confirmada com sucesso! Custo: R$${response.data.value}`);
      } else {
        alert("Erro ao confirmar a viagem.");
      }
    } catch (error) {
      console.error("Erro ao confirmar a viagem:", error);
      alert("Erro ao confirmar a viagem.");
    }
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={apikey!}>
        <MapContainer directions={directions} />
      </LoadScript>

      {/* Botão de confirmar */}
      {directions && !showDrivers && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowDrivers(true)}
            className="px-6 py-2 text-lg cursor-pointer bg-green-500 text-white rounded-lg"
          >
            Confirmar
          </button>
        </div>
      )}

      {/* Lista de motoristas */}
      {showDrivers && (
        <div className="mt-5">
          <h2 className="text-2xl font-semibold">Motoristas Disponíveis:</h2>
          <div>
            {drivers.map((driver) => (
              <DriverCard
                key={driver.driverId}
                driver={driver}
                onClick={() => setSelectedDriver(driver)}
              />
            ))}
          </div>

          {/* Exibe detalhes do motorista selecionado */}
          {selectedDriver && <DriverDetails driver={selectedDriver} />}

          <ConfirmButton onClick={handleConfirm} />
        </div>
      )}
    </div>
  );
};

export default GoogleMapsComponent;
