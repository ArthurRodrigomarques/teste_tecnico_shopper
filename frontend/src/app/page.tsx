"use client";

import { useState } from "react";
import GoogleMapsComponent from "@/components/GoogleMapsComponent";
import SearchAddress from "@/components/searchAddress";

export default function Home() {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [customerId] = useState<string>("3981bb7d-1409-4a77-afbc-2c68ffa0d5cd");

  return (
    <div className="flex flex-col lg:flex-row w-full overflow-hidden pl-4 lg:pl-[10%]">
      {/* Sidebar */}
      <div className="w-full lg:w-[30%] h-auto lg:h-full flex items-center justify-center p-4">
        <SearchAddress onSetOrigin={setOrigin} onSetDestination={setDestination} />
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-[70%] h-auto lg:h-full">
        {origin && destination ? (
          <GoogleMapsComponent
            origin={origin}
            destination={destination}
            customerId={customerId}
          />
        ) : (
          <p className="text-center mt-4">
            Insira o local de partida e destino para visualizar a rota no mapa.
          </p>
        )}
      </div>
    </div>
  );
}
