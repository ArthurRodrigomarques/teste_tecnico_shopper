"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rides, setRides] = useState<Ride[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState<string>(searchParams.get("driverId") || ""); // Inicializa com o valor da query string
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/drivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Erro ao carregar motoristas:", error);
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
            driverId: driverId || undefined, // Envia apenas se houver driverId
          },
        });
        setRides(response.data.rides || []);
      } catch (error) {
        console.error("Erro ao carregar histórico de viagens:", error);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [customerId, driverId]);

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

      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Voltar
      </button>

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
        {rides && rides.length > 0 ? (
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
        ) : driverId ? (
          <p>Nenhuma viagem encontrada para este motorista.</p>
        ) : (
          <p>Nenhuma viagem registrada.</p>
        )}
      </ul>
    </div>
  );
}
