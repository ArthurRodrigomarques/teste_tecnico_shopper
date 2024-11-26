"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ThemeToggle from "./themeToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function NavBar() {
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userId = "3981bb7d-1409-4a77-afbc-2c68ffa0d5cd";

    axios
      .get(`http://localhost:8080/get-unique-user/${userId}`)
      .then((response) => {
        setUser(response.data); 
      })
      .catch((error) => {
        console.error("Erro ao buscar o usuário:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

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
              <p>Convidado</p>
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
