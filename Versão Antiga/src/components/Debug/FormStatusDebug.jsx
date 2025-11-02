import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormStatusDebug = () => {
  const [formStatus, setFormStatus] = useState({});
  const [rawData, setRawData] = useState({});

  const checkFormStatus = () => {
    try {
      // Dados raw do localStorage
      const personalDataRaw = localStorage.getItem('sleepProfileFormData');
      const completeProfileRaw = localStorage.getItem('completeUserProfile');
      const personalFlag = localStorage.getItem('personalDataFormCompleted');
      const insomniaFlag = localStorage.getItem('insomniaQuestionnaireCompleted');

      // Parse dos dados
      const personalData = personalDataRaw ? JSON.parse(personalDataRaw) : null;
      const completeProfile = completeProfileRaw ? JSON.parse(completeProfileRaw) : null;

      // Status calculado
      const status = {
        personalData: personalData?.formCompleted || !!personalFlag,
        insomniaQuestionnaire: completeProfile?.formCompleted || !!insomniaFlag,
        hasAnamnesis: !!(completeProfile?.completedAt && completeProfile?.insomniaAnswers)
      };

      setRawData({
        personalDataRaw: !!personalDataRaw,
        personalDataParsed: !!personalData,
        personalDataCompleted: personalData?.formCompleted,
        personalFlag: !!personalFlag,
        completeProfileRaw: !!completeProfileRaw,
        completeProfileParsed: !!completeProfile,
        completeProfileCompleted: completeProfile?.formCompleted,
        insomniaFlag: !!insomniaFlag,
        hasCompletedAt: !!completeProfile?.completedAt,
        hasInsomniaAnswers: !!completeProfile?.insomniaAnswers
      });

      setFormStatus(status);
    } catch (error) {
      console.error('Erro no debug:', error);
    }
  };

  useEffect(() => {
    checkFormStatus();
    const interval = setInterval(checkFormStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearAllData = () => {
    localStorage.removeItem('sleepProfileFormData');
    localStorage.removeItem('completeUserProfile');
    localStorage.removeItem('personalDataFormCompleted');
    localStorage.removeItem('insomniaQuestionnaireCompleted');
    console.log('🗑️ Todos os dados limpos');
    checkFormStatus();
  };

  return (
    <DebugContainer>
      <DebugTitle>🔍 Debug - Status dos Formulários</DebugTitle>
      
      <Section>
        <SectionTitle>📊 Status Final</SectionTitle>
        <StatusGrid>
          <StatusItem completed={formStatus.personalData}>
            📝 Dados Pessoais: {formStatus.personalData ? '✅' : '❌'}
          </StatusItem>
          <StatusItem completed={formStatus.insomniaQuestionnaire}>
            🧠 Questionário: {formStatus.insomniaQuestionnaire ? '✅' : '❌'}
          </StatusItem>
          <StatusItem completed={formStatus.hasAnamnesis}>
            📋 Anamnese: {formStatus.hasAnamnesis ? '✅' : '❌'}
          </StatusItem>
        </StatusGrid>
      </Section>

      <Section>
        <SectionTitle>🔧 Dados Técnicos</SectionTitle>
        <TechnicalData>
          <pre>{JSON.stringify(rawData, null, 2)}</pre>
        </TechnicalData>
      </Section>

      <ActionButton onClick={clearAllData}>
        🗑️ Limpar Todos os Dados
      </ActionButton>
    </DebugContainer>
  );
};

const DebugContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 350px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  max-height: 80vh;
  overflow-y: auto;
`;

const DebugTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #555;
  font-size: 14px;
`;

const StatusGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusItem = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  background: ${props => props.completed ? '#e8f5e8' : '#ffeaea'};
  color: ${props => props.completed ? '#2d5a2d' : '#8b0000'};
  font-size: 12px;
  font-weight: 500;
`;

const TechnicalData = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-size: 10px;
  overflow-x: auto;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #ff3838;
  }
`;

export default FormStatusDebug;