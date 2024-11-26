import React from "react";

interface Driver {
  driverId: string;
  name: string;
  description: string;
  car: string;
  rating: string;
  totalCost: number;
}

interface DriverCardProps {
  driver: Driver;
  onClick: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-300 p-4 mt-4 rounded-lg cursor-pointer bg-black text-white"
    >
      <h3 className="text-xl font-bold">{driver.name}</h3>
      <p>{driver.description}</p>
      <p><strong>Carro:</strong> {driver.car}</p>
      <p><strong>Avaliação:</strong> {driver.rating}</p>
      <p><strong>Custo Total:</strong> R${driver.totalCost.toFixed(2)}</p>
    </div>
  );
};

export default DriverCard;
