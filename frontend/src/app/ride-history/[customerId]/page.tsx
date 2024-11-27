"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function RideHistory({ params }: { params: { customerId: string } }) {
  const [customerId, setCustomerId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setCustomerId(resolvedParams.customerId);
    };
    fetchParams();
  }, [params]);

  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return; 

    const fetchRides = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ride/${customerId}`);
        setRides(response.data.rides);
      } catch (error) {
        console.error("Erro ao carregar histórico de viagens:", error);
        alert("Erro ao carregar o histórico de viagens.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [customerId]);

  if (loading) return <p>Carregando histórico de viagens...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Histórico de Viagens</h1>
      {rides.length > 0 ? (
        <ul>
          {rides.map((ride) => (
            <li key={ride.id} className="border p-4 mb-2">
              <p><strong>Data:</strong> {new Date(ride.date).toLocaleString()}</p>
              <p><strong>Origem:</strong> {ride.origin}</p>
              <p><strong>Destino:</strong> {ride.destination}</p>
              <p><strong>Distância:</strong> {ride.distance} km</p>
              <p><strong>Duração:</strong> {ride.duration}</p>
              <p><strong>Motorista:</strong> {ride.driver.name}</p>
              <p><strong>Valor:</strong> R$ {ride.value.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma viagem encontrada.</p>
      )}
    </div>
  );
}
