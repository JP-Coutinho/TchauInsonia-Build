import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
import Sidebar from "../Nav/Sidebar";
import Backdrop from "../Elements/Backdrop";
import FormStatusDebug from "../Debug/FormStatusDebug";
import LogoIcon from "../../assets/svg/Logo";
import BurgerIcon from "../../assets/svg/BurgerIcon";
import NotificationIcon from "../../assets/svg/NotificationIcon"; 
import { auth } from "../../firebase";  
import { signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const [y, setY] = useState(window.scrollY);
  const navigate = useNavigate();
  const [sidebarOpen, toggleSidebar] = useState(false);
  const [user, setUser] = useState(null); 
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hasCompletedForms, setHasCompletedForms] = useState(false);
  const [formStatus, setFormStatus] = useState({
    personalData: false,
    insomniaQuestionnaire: false,
    hasAnamnesis: false
  });

  // Função para verificar status dos formulários
  const checkFormStatus = () => {
    try {
      // Verificar dados pessoais
      const personalData = localStorage.getItem('sleepProfileFormData');
      const personalDataParsed = personalData ? JSON.parse(personalData) : null;
      const personalDataCompleted = personalDataParsed?.formCompleted || !!localStorage.getItem('personalDataFormCompleted');
      
      // Verificar questionário de insônia
      const completeProfile = localStorage.getItem('completeUserProfile');
      const completeProfileParsed = completeProfile ? JSON.parse(completeProfile) : null;
      const insomniaCompleted = completeProfileParsed?.formCompleted || !!localStorage.getItem('insomniaQuestionnaireCompleted');
      
      // Verificar se tem anamnese (completou tudo)
      const hasAnamnesis = completeProfileParsed?.completedAt && completeProfileParsed?.insomniaAnswers;
      
      const status = {
        personalData: personalDataCompleted,
        insomniaQuestionnaire: insomniaCompleted,
        hasAnamnesis: !!hasAnamnesis
      };
      
      setFormStatus(status);
      
      // Verificar se todos os formulários foram completados
      const allCompleted = status.personalData && status.insomniaQuestionnaire && status.hasAnamnesis;
      setHasCompletedForms(allCompleted);
      
      console.log('📋 Status detalhado dos formulários:', {
        personalDataRaw: !!personalDataParsed,
        personalDataCompleted,
        insomniaRaw: !!completeProfileParsed,
        insomniaCompleted,
        hasAnamnesis,
        finalStatus: status,
        allCompleted
      });
      
      return status;
    } catch (error) {
      console.error('❌ Erro ao verificar status dos formulários:', error);
      return { personalData: false, insomniaQuestionnaire: false, hasAnamnesis: false };
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      // Verificar status dos formulários quando usuário logado
      if (currentUser) {
        checkFormStatus();
      }
    });

    window.addEventListener("scroll", () => setY(window.scrollY));
    
    // Verificar formulários periodicamente (a cada 5 segundos)
    const interval = setInterval(() => {
      if (user) {
        checkFormStatus();
      }
    }, 5000);
    
    return () => {
      unsubscribe(); 
      window.removeEventListener("scroll", () => setY(window.scrollY));
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      console.log("Usuário desconectado com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  const handleFormRedirect = () => {
    const {displayName, email, photoURL, uid } = user;
    setNotificationOpen(false); // Fecha o menu de notificação
    navigate("/formulario",  { state: { user: { displayName, email, photoURL, uid } } }); // Redireciona para a rota do formulário
  };



  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleNavigation = (route) => {
    if (user) {
      const { displayName, email } = user;
      navigate(route, { state: { user: { displayName, email } } });
    }
    setUserDropdownOpen(false); // Fecha o menu do usuário
  };

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper className="flexCenter animate whiteBg" style={y > 100 ? { height: "60px" } : { height: "80px" }}>
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" to="home" smooth={true}>
            <LogoIcon />
            <h1 style={{ marginLeft: "15px" }} className="font20 extraBold">
              Tchau Insônia
            </h1>
          </Link>
          <BurderWrapper className="pointer" onClick={() => toggleSidebar(!sidebarOpen)}>
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="home" spy={true} smooth={true} offset={-80}>
                Home
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="services" spy={true} smooth={true} offset={-80}>
                Serviços
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="projects" spy={true} smooth={true} offset={-80}>
                Casos de sucesso
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="pricing" spy={true} smooth={true} offset={-80}>
                Planos
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="contact" spy={true} smooth={true} offset={-80}>
                Contato
              </Link>
            </li>
          </UlWrapper>
          <UlWrapperRight className="flexNullCenter">
            {!user ? (
              <>
                <li className="semiBold font15 pointer">
                  <a href="/login" style={{ padding: "10px 30px 10px 0" }}>
                    Entrar
                  </a>
                </li>
                <li className="semiBold font15 pointer flexCenter">
                  <a href="/" className="radius8 lightBg" style={{ padding: "10px 15px" }}>
                    Começar agora
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="semiBold font15 pointer" onClick={handleUserDropdownToggle} style={{ position: "relative" }}>
                  <span className="radius8 lightBg" style={{ padding: "10px 15px", marginRight: "10px" }}>
                    Olá, {user.displayName}!
                  </span>
                  {userDropdownOpen && (
                    <UserDropdown>
                      <DropdownItem onClick={() => handleNavigation("/dashboard")}>Dashboard</DropdownItem>
                      <DropdownItem onClick={() => handleNavigation("/")}>Home</DropdownItem>
                      <DropdownItem onClick={() => handleNavigation("/perfil")}>Meu Plano</DropdownItem>
                      <DropdownItem onClick={() => handleNavigation("/detalhes")}>Meu Perfil</DropdownItem>
                      <DropdownItem onClick={() => handleNavigation("/sala-bem-estar")}>Bem Estar</DropdownItem>
                    </UserDropdown>
                  )}
                </li>
                <li className="semiBold font15 pointer flexCenter">
                  <a className="radius8 lightBg" style={{ padding: "10px 15px" }} onClick={handleLogout}>
                    Sair
                  </a>
                </li>
                {/* Ícone de Notificação - Apenas se houver formulários pendentes */}
                {!hasCompletedForms && (
                  <li className="semiBold font15 pointer flexCenter" style={{ position: "relative" }}>
                    <NotificationIconWrapper>
                      <NotificationIcon 
                        onClick={handleNotificationClick} 
                        style={{ cursor: "pointer", marginLeft: "10px" }} 
                      />
                      <NotificationBadge>!</NotificationBadge>
                    </NotificationIconWrapper>
                    {notificationOpen && (
                      <NotificationMenu>
                        <NotificationTitle>Formulários Pendentes</NotificationTitle>
                        {!formStatus.personalData && (
                          <NotificationItem>
                            📋 Dados pessoais
                            <button onClick={handleFormRedirect}>Preencher</button>
                          </NotificationItem>
                        )}
                        {formStatus.personalData && !formStatus.insomniaQuestionnaire && (
                          <NotificationItem>
                            🧠 Questionário de insônia
                            <button onClick={() => {
                              setNotificationOpen(false);
                              navigate("/questionario-insonia", { state: { user: { displayName: user.displayName, email: user.email }, formData: JSON.parse(localStorage.getItem('sleepProfileFormData')) } });
                            }}>Continuar</button>
                          </NotificationItem>
                        )}
                        {formStatus.personalData && formStatus.insomniaQuestionnaire && !formStatus.hasAnamnesis && (
                          <NotificationItem>
                            🎩 Finalizar avaliação
                            <button onClick={() => {
                              setNotificationOpen(false);
                              navigate("/perfil", { state: { user: { displayName: user.displayName, email: user.email } } });
                            }}>Ver perfil</button>
                          </NotificationItem>
                        )}
                      </NotificationMenu>
                    )}
                  </li>
                )}
                
                {/* Confirmação visual quando tudo estiver completo */}
                {hasCompletedForms && (
                  <li className="semiBold font15 pointer flexCenter" style={{ position: "relative" }}>
                    <CompletedIndicator title="Todos os formulários foram completados!">
                      ✅
                    </CompletedIndicator>
                  </li>
                )}
              </>
            )}
          </UlWrapperRight>
        </NavInner>
      </Wrapper>
      {/* Componente de Debug - Remover em produção */}
      {/*process.env.NODE_ENV === 'development' && <FormStatusDebug /> */}
    </>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

const NavInner = styled.div`
  position: relative;
  height: 100%;
`;

const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  @media (max-width: 760px) {
    display: block;
  }
`;

const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;

const UlWrapperRight = styled.ul`
  @media (max-width: 760px) {
    display: none;
  }
`;

// Estilos aprimorados para o sistema de notificações
const NotificationIconWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const NotificationMenu = styled.div`
  position: absolute;
  top: 35px;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 300px;
  max-width: 350px;
  z-index: 1001;
  overflow: hidden;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  padding: 16px 20px 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #555;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }

  button {
    background: #7620ff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
    margin-left: 12px;

    &:hover {
      background: #5c19c7;
      transform: translateY(-1px);
    }
  }
`;

const CompletedIndicator = styled.div`
  font-size: 18px;
  color: #2ed573;
  cursor: pointer;
  animation: bounce 1s ease-in-out;
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
`;

// Estilos para o menu do usuário
const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;
