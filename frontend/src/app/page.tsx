"use client";

import { useState } from "react";
import GoogleMapsComponent from "@/components/GoogleMapsComponent";
import SearchAddress from "@/components/searchAddress";

export default function Home() {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [customerId] = useState<string>("df8ba903-237d-4dff-8190-16cb0fd60cc6");

  return (
    <div className="flex w-full overflow-hidden pl-[10%]">
      <div className="flex w-[80%] h-full">
        <div className="w-[30%] h-full flex items-center justify-center p-4">
          <SearchAddress onSetOrigin={setOrigin} onSetDestination={setDestination} />
        </div>

        <div className="w-[70%] h-full">
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
    </div>
  );
}
