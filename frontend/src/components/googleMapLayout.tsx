"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import api from "@/services/api"; // Importação do serviço API para requisições

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
  customerId: string; // ID do cliente para enviar na requisição
}

const containerStyle = {
  width: "100%",
  height: "70vh",
};

const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMapsComponent: React.FC<MapProps> = ({ origin, destination, customerId }) => {
  const [directions, setDirections] = useState<any>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showDrivers, setShowDrivers] = useState(false); // Estado para controlar exibição dos motoristas
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null); // Motorista selecionado

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
      // Logando os dados que serão enviados na requisição
      console.log("Dados da requisição para confirmar a viagem:", {
        customerId,
        origin,
        destination,
        driver: {
          id: selectedDriver.driverId,
          name: selectedDriver.name,
        },
      });
  
      // Mudando o método de POST para PATCH
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
  
  

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver); // Atualiza o motorista selecionado
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={apikey!}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: -23.5614744, lng: -46.6565306 }}
          zoom={12}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
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
              <div
                key={driver.driverId}
                onClick={() => handleDriverClick(driver)} // Atualiza o motorista selecionado
                className="border border-gray-300 p-4 mt-4 rounded-lg cursor-pointer bg-black text-white"
              >
                <h3 className="text-xl font-bold">{driver.name}</h3>
                <p>{driver.description}</p>
                <p>
                  <strong>Carro:</strong> {driver.car}
                </p>
                <p>
                  <strong>Avaliação:</strong> {driver.rating}
                </p>
                <p>
                  <strong>Custo Total:</strong> R${driver.totalCost.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Botão de confirmação */}
          {selectedDriver && (
            <div className="mt-5 text-center">
              <button
                onClick={handleConfirm}
                className="px-6 py-2 text-lg cursor-pointer bg-green-500 text-white rounded-lg"
              >
                Confirmar Viagem
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleMapsComponent;
