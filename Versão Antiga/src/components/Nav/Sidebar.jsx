import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Assets
import CloseIcon from "../../assets/svg/CloseIcon";
import LogoIcon from "../../assets/svg/Logo";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há dados do usuário no localStorage
    const userData = localStorage.getItem('userData');
    console.log("Dados do usuário no localStorage:", userData);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleNavigation = (route) => {
    window.location.href = route;
    toggleSidebar(false);
  };

  return (
    <Wrapper className="animate darkBg" sidebarOpen={sidebarOpen}>
      <SidebarHeader className="flexSpaceCenter">
        <div className="flexNullCenter">
          <LogoIcon />
          <h1 className="whiteColor font20" style={{ marginLeft: "15px" }}>
            Tchau Insonia
          </h1>
        </div>
        <CloseBtn onClick={() => toggleSidebar(!sidebarOpen)} className="animate pointer">
          <CloseIcon />
        </CloseBtn>
      </SidebarHeader>

      {/* Menu do usuário se estiver logado */}
      {user ? (
        <>
        <UlStyle className="flexNullCenter flexColumn">
          <li className="whiteColor" onClick={() => navigate("/",  { state: { user: { displayName: user.displayName, email: user.email, photoURL: user.photoURL, uid: user.uid } } })}>Home</li>
          <li className="whiteColor" onClick={() => navigate("/perfil",  { state: { user: { displayName: user.displayName, email: user.email, photoURL: user.photoURL, uid: user.uid } } })}>Meu Plano</li>
          <li className="whiteColor" onClick={() => navigate("/dashboard",  { state: { user: { displayName: user.displayName, email: user.email, photoURL: user.photoURL, uid: user.uid } } })}>Dashboard</li>
          <li className="whiteColor" onClick={() => navigate("/detalhes",  { state: { user: { displayName: user.displayName, email: user.email, photoURL: user.photoURL, uid: user.uid } } })}>Meu Perfil</li>
          <li className="whiteColor" onClick={() => navigate("/sala-bem-estar",  { state: { user: { displayName: user.displayName, email: user.email, photoURL: user.photoURL, uid: user.uid } } })}>Bem Estar</li>
        </UlStyle>
        <UlStyle className="flexSpaceCenter">
            <li className="semiBold font15 pointer">
              <a href="/login" style={{ padding: "10px 30px 10px 0" }} 
              className="whiteColor"
              onClick={() => {
            localStorage.removeItem('userData');
            window.location.href = '/';
          }}>
                Sair
              </a>
            </li>
          </UlStyle>
      </>
      ) : (
        <>
          <UlStyle className="flexNullCenter flexColumn">
            <li className="semiBold font15 pointer">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass="active"
                className="whiteColor"
                style={{ padding: "10px 15px" }}
                to="home"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Home
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass="active"
                className="whiteColor"
                style={{ padding: "10px 15px" }}
                to="services"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Serviços
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass="active"
                className="whiteColor"
                style={{ padding: "10px 15px" }}
                to="projects"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Casos de sucesso
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass="active"
                className="whiteColor"
                style={{ padding: "10px 15px" }}
                to="pricing"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Planos
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass="active"
                className="whiteColor"
                style={{ padding: "10px 15px" }}
                to="contact"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Contatos
              </Link>
            </li>
          </UlStyle>
          <UlStyle className="flexSpaceCenter">
            <li className="semiBold font15 pointer">
              <a href="/login" style={{ padding: "10px 30px 10px 0" }} className="whiteColor">
                Entrar
              </a>
            </li>
            <li className="semiBold font15 pointer flexCenter">
              <a href="/" className="radius8 lightBg" style={{ padding: "10px 15px" }}>
                Começar Agora
              </a>
            </li>
          </UlStyle>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  width: 400px;
  height: 100vh;
  position: fixed;
  top: 0;
  padding: 0 30px;
  right: ${(props) => (props.sidebarOpen ? "0px" : "-400px")};
  z-index: 9999;
  @media (max-width: 400px) {
    width: 100%;
  }
`;
const SidebarHeader = styled.div`
  padding: 20px 0;
`;
const CloseBtn = styled.button`
  border: 0px;
  outline: none;
  background-color: transparent;
  padding: 10px;
`;
const UlStyle = styled.ul`
  padding: 40px;
  li {
    margin: 20px 0;
  }
`;
