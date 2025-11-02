import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../../firebase";  
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  // Função para lidar com o login do Google
  const navigate = useNavigate(); // Hook para navegação
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Pega apenas as propriedades necessárias do usuário
      const { displayName, email, photoURL, uid } = result.user;
      
      // Salva os dados do usuário no localStorage
      localStorage.setItem('userData', JSON.stringify({ displayName, email, photoURL, uid }));
      
      // Verificar se já tem acesso pago
      const hasAccess = localStorage.getItem('accessGranted') === 'true';
      
      if (hasAccess) {
        // Se já pagou, vai direto para o questionário
        navigate('/questionario-insonia', { 
          state: { 
            user: { displayName, email, photoURL, uid },
            formData: JSON.parse(localStorage.getItem('sleepProfileFormData') || '{}'),
            paymentCompleted: true 
          }
        });
      } else {
        // Se não pagou, vai para o formulário inicial
        navigate('/formulario', { state: { user: { displayName, email, photoURL, uid } }});
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <Wrapper>
      <LoginContainer>
        <h2 className="font30 extraBold">Login</h2>
        <LoginForm>
          <Label className="font13">Email</Label>
          <Input type="email" placeholder="Digite seu email" />

          <Label className="font13">Senha</Label>
          <Input type="password" placeholder="Digite sua senha" />

          <LoginButton className="fullButton">Entrar</LoginButton>
          
          <Divider className="font13">Ou</Divider>

          <GoogleButton onClick={handleGoogleLogin}>
            <FcGoogle size={20} />
            <span className="font13">Entrar com Google</span>
          </GoogleButton>
        </LoginForm>
      </LoginContainer>
    </Wrapper>
  );
}

// Styled-components
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  text-align: left;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
`;

const LoginButton = styled.button`
  padding: 10px;
  background-color: #4f4f4f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #333;
  }
`;

const Divider = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::before,
  &::after {
    content: "";
    height: 1px;
    background-color: #ccc;
    width: 40%;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

  span {
    margin-left: 10px;
    font-size: 14px;
    color: #555;
  }
`;
