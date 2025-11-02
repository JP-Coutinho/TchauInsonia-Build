import React from "react";
// Sections
import TopNavbar from "../components/Nav/TopNavbar";
import { useLocation } from "react-router-dom";
import Detail from "../components/Detail/Detail";
export default function DetailPage() {
  const location = useLocation();
  console.log('entrei aqui')
  const user = location.state?.user;
  console.log('Detalhes',user);
    
  // Verifica se o user está disponível antes de acessar as propriedades
  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <>
      <TopNavbar />
      <Detail user={user} />
    </>
  );
}