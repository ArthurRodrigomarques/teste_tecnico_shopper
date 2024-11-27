"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

interface Ride {
  id: string;
  date: string;
  driver: {
    name: string;
  };
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  value: number;
}

interface Driver {
  id: string;
  name: string;
}

export default function RideHistory() {
  const { customerId } = useParams<{ customerId: string }>();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState<string>("");
  const [drivers, setDrivers] = useState<Driver[]>([]); 
  const router = useRouter(); 

  
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/drivers");
        setDrivers(response.data); 
      } catch (error) {
        console.error("Erro ao carregar motoristas:", error);
        alert("Erro ao carregar motoristas.");
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    if (!customerId) return; 

    const fetchRides = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/ride/${customerId}`, {
          params: {
            driverId: driverId,
          },
        });
        setRides(response.data.rides); 
      } catch (error) {
        console.error("Erro ao carregar histórico de viagens:", error);
        alert("Erro ao carregar o histórico de viagens.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [customerId, driverId]);

  //  seleção de motorista
  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDriverId = e.target.value;
    setDriverId(selectedDriverId);

    if (selectedDriverId) {
      router.replace(`/ride-history/${customerId}?driverId=${selectedDriverId}`);
    } else {
      router.replace(`/ride-history/${customerId}`); 
    }
  };

  if (loading) return <p>Carregando histórico de viagens...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Histórico de Viagens</h1>

      <div className="mb-4">
        <label className="block mb-2">Selecionar Motorista:</label>
        <select
          value={driverId}
          onChange={handleDriverChange} 
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-6">
        {rides.length > 0 ? (
          rides.map((ride) => (
            <li key={ride.id} className="border p-4 mb-4 rounded-lg shadow-md">
              <p><strong>Data:</strong> {new Date(ride.date).toLocaleString()}</p>
              <p><strong>Motorista:</strong> {ride.driver.name}</p>
              <p><strong>Origem:</strong> {ride.origin}</p>
              <p><strong>Destino:</strong> {ride.destination}</p>
              <p><strong>Distância:</strong> {ride.distance} km</p>
              <p><strong>Duração:</strong> {ride.duration}</p>
              <p><strong>Valor:</strong> R$ {ride.value.toFixed(2)}</p>
            </li>
          ))
        ) : (
          <p>Nenhuma viagem encontrada.</p>
        )}
      </ul>
    </div>
  );
}
