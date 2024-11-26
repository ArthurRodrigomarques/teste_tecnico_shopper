import React from "react";

interface Driver {
  driverId: string;
  name: string;
  description: string;
  car: string;
  rating: string;
  totalCost: number;
}

interface DriverDetailsProps {
  driver: Driver;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver }) => {
  return (
    <div className="mt-5">
      <h3 className="text-2xl font-semibold">Detalhes do Motorista Selecionado:</h3>
      <div className="border p-4 mt-4 rounded-lg bg-gray-100">
        <h4 className="text-xl font-bold">{driver.name}</h4>
        <p><strong>Carro:</strong> {driver.car}</p>
        <p><strong>Avaliação:</strong> {driver.rating}</p>
        <p><strong>Custo Total:</strong> R${driver.totalCost.toFixed(2)}</p>
        <p><strong>Descrição:</strong> {driver.description}</p>
      </div>
    </div>
  );
};

export default DriverDetails;
