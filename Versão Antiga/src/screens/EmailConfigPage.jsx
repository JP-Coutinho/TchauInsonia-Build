import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TopNavbar from '../components/Nav/TopNavbar';

export default function EmailConfigPage() {
  const [config, setConfig] = useState({
    emailServiceId: '',
    emailTemplateId: '',
    emailPublicKey: '',
    fromEmail: 'ordepoaoj@live.com',
    fromName: 'Tchau Insônia'
  });

  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('emailConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveConfig = () => {
    localStorage.setItem('emailConfig', JSON.stringify(config));
    alert('Configurações de email salvas com sucesso!');
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Digite um email para teste');
      return;
    }

    setIsTesting(true);
    try {
      const { testEmailService } = await import('../services/emailServiceFixed');
      
      const testData = {
        to_name: 'Usuário Teste',
        user_email: testEmail,
        payment_amount: 'R$ 29,90',
        generated_password: '123456',
        login_url: window.location.origin
      };

      const result = await testEmailService(testEmail, testData);
      
      setTestResult({
        success: result.success,
        message: result.message || (result.success ? 'Email de teste enviado com sucesso!' : 'Erro ao enviar email de teste')
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao enviar email de teste: ' + error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <TopNavbar />
      <ConfigContainer>
        <ConfigWrapper>
          <Header>
            <Title>⚙️ Configuração de Email</Title>
            <Subtitle>Configure o sistema de envio de emails da plataforma</Subtitle>
          </Header>

          <ConfigSection>
            <SectionTitle>📧 Configurações SMTP/EmailJS</SectionTitle>
            
            <FormField>
              <Label>Service ID (EmailJS)</Label>
              <Input
                type="text"
                name="emailServiceId"
                value={config.emailServiceId}
                onChange={handleConfigChange}
                placeholder="service_xxxxxxxxx"
              />
              <HelpText>ID do serviço no EmailJS</HelpText>
            </FormField>

            <FormField>
              <Label>Template ID</Label>
              <Input
                type="text"
                name="emailTemplateId"
                value={config.emailTemplateId}
                onChange={handleConfigChange}
                placeholder="template_xxxxxxxxx"
              />
              <HelpText>ID do template de email</HelpText>
            </FormField>

            <FormField>
              <Label>Public Key</Label>
              <Input
                type="text"
                name="emailPublicKey"
                value={config.emailPublicKey}
                onChange={handleConfigChange}
                placeholder="your_public_key"
              />
              <HelpText>Chave pública do EmailJS</HelpText>
            </FormField>

            <FormField>
              <Label>Email Remetente</Label>
              <Input
                type="email"
                name="fromEmail"
                value={config.fromEmail}
                onChange={handleConfigChange}
                placeholder="ordepoaoj@live.com"
              />
              <HelpText>Email que aparecerá como remetente</HelpText>
            </FormField>

            <FormField>
              <Label>Nome Remetente</Label>
              <Input
                type="text"
                name="fromName"
                value={config.fromName}
                onChange={handleConfigChange}
                placeholder="Tchau Insônia"
              />
            </FormField>

            <SaveButton onClick={handleSaveConfig}>
              💾 Salvar Configurações
            </SaveButton>
          </ConfigSection>

          <TestSection>
            <SectionTitle>🧪 Teste de Envio</SectionTitle>
            
            <FormField>
              <Label>Email para Teste</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="teste@email.com"
              />
            </FormField>

            <TestButton onClick={handleTestEmail} disabled={isTesting}>
              {isTesting ? '⏳ Enviando...' : '📨 Enviar Email de Teste'}
            </TestButton>

            {testResult && (
              <TestResult success={testResult.success}>
                {testResult.success ? '✅' : '❌'} {testResult.message}
              </TestResult>
            )}
          </TestSection>

          <InstructionsSection>
            <SectionTitle>📚 Instruções de Configuração</SectionTitle>
            
            <InstructionCard>
              <h4>1. Configurar EmailJS</h4>
              <ol>
                <li>Acesse <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer">emailjs.com</a></li>
                <li>Crie uma conta gratuita</li>
                <li>Adicione um serviço de email (Gmail, Outlook, etc.)</li>
                <li>Crie um template de email</li>
                <li>Copie as chaves e IDs para os campos acima</li>
              </ol>
            </InstructionCard>

            <InstructionCard>
              <h4>2. Template de Email</h4>
              <p>Use estas variáveis no seu template:</p>
              <CodeBlock>
                {`{{to_name}} - Nome do usuário
{{user_email}} - Email do usuário
{{payment_amount}} - Valor do pagamento
{{generated_password}} - Senha gerada
{{login_url}} - Link para login`}
              </CodeBlock>
            </InstructionCard>

            <InstructionCard>
              <h4>3. Email de Origem</h4>
              <p>Configure o email <strong>ordepoaoj@live.com</strong> como remetente autorizado no seu provedor de email.</p>
            </InstructionCard>
          </InstructionsSection>
        </ConfigWrapper>
      </ConfigContainer>
    </>
  );
}

// Styled Components
const ConfigContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 120px 20px 40px;
`;

const ConfigWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ConfigSection = styled.div`
  padding: 40px;
  border-bottom: 1px solid #e9ecef;
`;

const TestSection = styled.div`
  padding: 40px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const InstructionsSection = styled.div`
  padding: 40px;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
`;

const FormField = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const HelpText = styled.small`
  display: block;
  color: #6c757d;
  margin-top: 5px;
  font-size: 0.85rem;
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
`;

const TestButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const TestResult = styled.div`
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  background: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
`;

const InstructionCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;

  h4 {
    color: #333;
    margin-bottom: 15px;
  }

  ol, ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 5px;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CodeBlock = styled.pre`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  padding: 15px;
  font-size: 0.9rem;
  color: #333;
  overflow-x: auto;
  white-space: pre-wrap;
`;