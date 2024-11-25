"use client"

import { useState, useEffect } from "react";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SearchAddress() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (id: string) => {
    localStorage.setItem("userId", id);
    setUserId(id);
  };

  if (userId) {
    // Se o usuário estiver logado, renderiza a tela de adicionar endereço
    return (
      <Card className="mx-auto max-w-sm mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Faça uma viagem</CardTitle>
        <CardDescription>coloque o seu local de partida e destino</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="partida">Partida</Label>
            <Input
              id="email"
              type="email"
              placeholder="insira o local de partida"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              type="text"
              placeholder="Para onde?"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
      </CardContent>
    </Card>
    );
  }

  return <LoginForm onLogin={handleLogin} />;
}
