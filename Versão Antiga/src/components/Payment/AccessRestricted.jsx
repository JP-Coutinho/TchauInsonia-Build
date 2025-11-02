import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function AccessRestricted({ 
  title = "Acesso Restrito", 
  message = "Esta funcionalidade está disponível apenas para usuários premium.",
  user,
  formData,
  onUpgrade 
}) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate("/pagamento", { 
        state: { 
          user: user, 
          formData: formData,
          upgradeRequest: true
        } 
      });
    }
  };

  return (
    <RestrictedContainer>
      <RestrictedContent>
        <Icon>🔒</Icon>
        <Title>{title}</Title>
        <Message>{message}</Message>
        
        <FeaturesList>
          <FeatureItem>✨ Questionário completo de insônia</FeatureItem>
          <FeatureItem>📊 Relatório personalizado detalhado</FeatureItem>
          <FeatureItem>🏠 Acesso à Sala de Bem-Estar</FeatureItem>
          <FeatureItem>📚 Conteúdos exclusivos sobre sono</FeatureItem>
          <FeatureItem>👥 Acompanhamento personalizado</FeatureItem>
        </FeaturesList>

        <PriceBox>
          <PriceText>Por apenas</PriceText>
          <Price>R$ 197,00</Price>
          <PriceSubtext>pagamento único</PriceSubtext>
        </PriceBox>

        <UpgradeButton onClick={handleUpgrade}>
          🚀 Fazer Upgrade para Premium
        </UpgradeButton>
      </RestrictedContent>
    </RestrictedContainer>
  );
}

const RestrictedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;
`;

const RestrictedContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 3px solid #f8f9fa;
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const Message = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 25px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 25px 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  color: #555;
  font-size: 1rem;
  margin-bottom: 10px;
  padding-left: 10px;
`;

const PriceBox = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin: 25px 0;
`;

const PriceText = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 5px;
`;

const Price = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const PriceSubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const UpgradeButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;