import React from "react";
// Sections
import TopNavbar from "../components/Nav/TopNavbar";
import Dashboard from "../components/DashBoard/dashboard";
import { useLocation } from "react-router-dom";

export default function DashBoardPage() {
  const location = useLocation();
  const user = location.state?.user; // Aqui, 'user' contém as propriedades serializáveis
    
  // Verifica se o user está disponível antes de acessar as propriedades
  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <>
      <TopNavbar />
      <Dashboard 
        displayName={user.displayName} 
        email={user.email} 
        />
    </>
  );
}