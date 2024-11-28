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
  onGoBack: () => void; 
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver, onGoBack }) => {
  return (
    <div className="mt-5">
      <h3 className="text-2xl font-semibold">Detalhes do Motorista Selecionado:</h3>
      <div className="border p-4 mt-4 rounded-lg">
        <h4 className="text-xl font-bold">{driver.name}</h4>
        <p><strong>Carro:</strong> {driver.car}</p>
        <p><strong>Avaliação:</strong> {driver.rating}</p>
        <p><strong>Custo Total:</strong> R${driver.totalCost.toFixed(2)}</p>
        <p><strong>Descrição:</strong> {driver.description}</p>
      </div>
      <button
        onClick={onGoBack}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Voltar
      </button>
      
    </div>
  );
};

export default DriverDetails;
