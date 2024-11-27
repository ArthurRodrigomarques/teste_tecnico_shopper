import React from "react";

interface Driver {
  driverId: string;
  name: string;
  description: string;
  car: string;
  rating: string;
  totalCost: number;
  estimatedTime: string;
  distance: string;
}

interface DriverCardProps {
  driver: Driver;
  onClick: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, onClick }) => {
  return (
    <div
      className="p-4 border rounded-lg shadow-md cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold">{driver.name}</h3>
      <p><strong>Carro:</strong> {driver.car}</p>
      <p><strong>Tempo Estimado:</strong> {driver.estimatedTime} minutos</p>
      <p><strong>Distância:</strong> {driver.distance}</p>
      <p><strong>Custo Total:</strong> R${driver.totalCost.toFixed(2)}</p>
    </div>
  );
};

export default DriverCard;
