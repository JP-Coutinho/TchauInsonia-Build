import React from "react";
// Sections
import TopNavbar from "../components/Nav/TopNavbar";
import { useLocation } from "react-router-dom";
import SleepProfileForm from "../components/Forms/Forms";

export default function FormularyPage() {
  const location = useLocation();
  const user = location.state?.user; 
  console.log(user);// Aqui, 'user' contém as propriedades serializáveis
    
  // Verifica se o user está disponível antes de acessar as propriedades
  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <>
      <TopNavbar />
      <SleepProfileForm
        displayName={user.displayName} 
        email={user.email} 
        />
    </>
  );
}