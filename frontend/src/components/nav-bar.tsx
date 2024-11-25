"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import ThemeToggle from "./themeToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function NavBar() {
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      // Fazer a requisição para a rota que retorna o usuário
      axios
        .get(`http://localhost:8080/get-unique-user/${storedUserId}`)
        .then((response) => {
          setUser(response.data); 
        })
        .catch((error) => {
          console.error("Erro ao buscar o usuário:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Extrair a primeira letra do nome do usuário
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div>
      <div className="flex w-full pt-4 pb-4 pl-5 pr-5 items-center justify-between bg-secondary">
        <div className="pl-10">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 pr-10">
          {user ? (
            <div className="text-right">
              <p>{user.name}</p>
              <p>{user.email}</p> 
            </div>
          ) : (
            <div className="text-right">
              <p>Guest</p>
            </div>
          )}

          <Avatar>
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
