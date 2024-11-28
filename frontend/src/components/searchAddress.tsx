"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchAddressProps {
  onSetOrigin: (origin: string) => void;
  onSetDestination: (destination: string) => void;
}

const SearchAddress: React.FC<SearchAddressProps> = ({ onSetOrigin, onSetDestination }) => {
  const [originInput, setOriginInput] = useState<string>(""); 
  const [destinationInput, setDestinationInput] = useState<string>("");

  const handleSubmit = () => {
    if (originInput && destinationInput) {
      onSetOrigin(originInput);
      onSetDestination(destinationInput);
    } else {
      alert("Por favor, insira os endereços de origem e destino.");
    }
  };

  return (
    <Card className="mx-auto max-w-sm mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Faça uma viagem</CardTitle>
        <CardDescription>Insira o local de partida e destino</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="origin">Partida</Label>
            <Input
              id="origin"
              type="text"
              placeholder="Local de partida"
              required
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              type="text"
              placeholder="Local de destino"
              required
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Calcular Rota
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAddress;
