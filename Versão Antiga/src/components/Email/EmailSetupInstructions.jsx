import React from 'react';
import styled from 'styled-components';

export default function EmailSetupInstructions() {
  return (
    <InstructionsContainer>
      <Title>📧 Como Configurar o Sistema de Email</Title>
      
      <Step>
        <StepNumber>1</StepNumber>
        <StepContent>
          <StepTitle>Criar Conta no EmailJS</StepTitle>
          <p>Acesse <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer">emailjs.com</a> e crie uma conta gratuita.</p>
        </StepContent>
      </Step>

      <Step>
        <StepNumber>2</StepNumber>
        <StepContent>
          <StepTitle>Configurar Serviço de Email</StepTitle>
          <p>No painel do EmailJS:</p>
          <ul>
            <li>Vá em "Email Services"</li>
            <li>Clique em "Add New Service"</li>
            <li>Escolha seu provedor (Gmail, Outlook, etc.)</li>
            <li>Configure com o email: <strong>ordepoaoj@live.com</strong></li>
            <li>Copie o <strong>Service ID</strong> gerado</li>
          </ul>
        </StepContent>
      </Step>

      <Step>
        <StepNumber>3</StepNumber>
        <StepContent>
          <StepTitle>Criar Template de Email</StepTitle>
          <p>Em "Email Templates", crie um template com estas variáveis:</p>
          <TemplateCode>
{`Assunto: 🎉 Pagamento Confirmado - Tchau Insônia

Olá {{to_name}},

Seu pagamento foi processado com sucesso!

Valor: R$ {{payment_amount}}
Data: {{payment_date}}
Cartão: **** **** **** {{card_last4}}

Sua senha de acesso: {{generated_password}}

Acesse: {{login_url}}

Suporte: {{support_email}}`}
          </TemplateCode>
          <p>Copie o <strong>Template ID</strong> gerado</p>
        </StepContent>
      </Step>

      <Step>
        <StepNumber>4</StepNumber>
        <StepContent>
          <StepTitle>Obter Chave Pública</StepTitle>
          <p>Em "General" → "API Keys", copie sua <strong>Public Key</strong></p>
        </StepContent>
      </Step>

      <Step>
        <StepNumber>5</StepNumber>
        <StepContent>
          <StepTitle>Configurar na Plataforma</StepTitle>
          <p>Acesse <strong>/config-email</strong> e insira:</p>
          <ul>
            <li>Service ID</li>
            <li>Template ID</li>
            <li>Public Key</li>
            <li>Email: ordepoaoj@live.com</li>
            <li>Nome: Tchau Insônia</li>
          </ul>
        </StepContent>
      </Step>

      <TestSection>
        <h3>🧪 Teste o Sistema</h3>
        <p>Após configurar, use o teste na página de configuração para verificar se os emails estão sendo enviados corretamente.</p>
      </TestSection>

      <ImportantNote>
        <h3>⚠️ Importante</h3>
        <ul>
          <li>O email <strong>ordepoaoj@live.com</strong> deve estar configurado no serviço</li>
          <li>Verifique a pasta de spam dos destinatários</li>
          <li>EmailJS tem limite de 200 emails/mês no plano gratuito</li>
          <li>Para produção, considere um plano pago ou API própria</li>
        </ul>
      </ImportantNote>
    </InstructionsContainer>
  );
}

const InstructionsContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
`;

const Step = styled.div`
  display: flex;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #007bff;
`;

const StepNumber = styled.div`
  background: #007bff;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 20px;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const TemplateCode = styled.pre`
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 15px 0;
`;

const TestSection = styled.div`
  background: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  border-left: 4px solid #2196f3;

  h3 {
    color: #1565c0;
    margin-bottom: 10px;
  }

  p {
    color: #333;
    margin: 0;
  }
`;

const ImportantNote = styled.div`
  background: #fff3cd;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #ffc107;

  h3 {
    color: #856404;
    margin-bottom: 15px;
  }

  ul {
    color: #333;
    margin: 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }

  strong {
    color: #856404;
  }
`;