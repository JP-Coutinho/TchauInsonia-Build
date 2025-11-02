import React, { useEffect } from "react";
import TopNavbar from "../components/Nav/TopNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../components/Profile/profile";
import WellnessRoom from "../components/Wellness/WellnessRoom";

export default function WellNessRoomPage() {
      const location = useLocation();
      const navigate = useNavigate();
      const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));
    
      useEffect(() => {
        console.log(user); // Aqui, 'user' contém as propriedades serializáveis
        if (!user) {
          console.log("Usuário não encontrado, redirecionando para login.");
          navigate("/login");
        }
      }, [user, navigate]);
    
      if (!user) return null; // Evita renderizar antes do redirect
    return (
        <>
            <TopNavbar />
            <WellnessRoom />
        </>
    );
}