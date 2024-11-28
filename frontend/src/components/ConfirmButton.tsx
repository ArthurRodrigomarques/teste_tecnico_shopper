import React from "react";

interface ConfirmButtonProps {
  onClick: () => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-5 text-center mb-20">
      <button
        onClick={onClick}
        className="px-6 py-2 text-lg cursor-pointer bg-green-500 text-white rounded-lg"
      >
        Confirmar Viagem
      </button>
    </div>
  );
};

export default ConfirmButton;
