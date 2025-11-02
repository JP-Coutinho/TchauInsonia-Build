import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Nav/TopNavbar";
import { generateRandomPassword, sendPaymentConfirmationEmail, shouldUseSimulation, sendViaLocalSimulation } from "../services/emailServiceFixed";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, formData, insomniaAnswers, accessDenied } = location.state || {};
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    installments: "1"
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Preço do serviço
  const servicePrice = 197.00;
  const installmentPrice = servicePrice; // Para 1x

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Formatar número do cartão
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }
    
    // Formatar data de vencimento
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }
    
    // Formatar CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }
    
    // Limitar nome do portador
    if (name === 'cardholderName') {
      formattedValue = value.toUpperCase();
    }
    
    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Limpar erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }
    
    if (!paymentData.expiryDate || paymentData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Data de vencimento inválida';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    if (!paymentData.cardholderName || paymentData.cardholderName.length < 3) {
      newErrors.cardholderName = 'Nome do portador obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Gerar senha aleatória para o usuário
      const randomPassword = generateRandomPassword(10);
      setGeneratedPassword(randomPassword);
      
      // Salvar dados de pagamento (sem dados sensíveis)
      const paymentRecord = {
        userId: user?.email,
        amount: servicePrice,
        installments: paymentData.installments,
        cardLast4: paymentData.cardNumber.slice(-4),
        processedAt: new Date().toISOString(),
        status: 'approved',
        transactionId: 'TXN' + Date.now()
      };
      
      localStorage.setItem('paymentRecord', JSON.stringify(paymentRecord));
      localStorage.setItem('accessGranted', 'true');
      
      // Salvar senha do usuário (criptografada em aplicação real)
      localStorage.setItem('userPassword_' + user?.email, randomPassword);
      
      // Salvar perfil completo com acesso pago
      const completeProfile = {
        personalData: formData,
        insomniaAnswers: insomniaAnswers,
        paymentRecord: paymentRecord,
        accessLevel: 'premium',
        completedAt: new Date().toISOString(),
        userPassword: randomPassword
      };
      
      localStorage.setItem('completeUserProfile', JSON.stringify(completeProfile));
      
      // Enviar email de confirmação com senha
      console.log('📧 Enviando email de confirmação...');
      const emailResult = await sendPaymentConfirmationEmail(user, paymentRecord, randomPassword);
      
      if (emailResult.success) {
        console.log('✅ Email enviado com sucesso!');
        setEmailSent(true);
      } else {
        console.log('⚠️ Falha no envio do email, mas pagamento foi processado');
        alert('Pagamento processado com sucesso! Houve um problema no envio do email, mas você já tem acesso à plataforma.');
      }
      
      // Mostrar sucesso por 3 segundos antes de redirecionar
      setTimeout(() => {
        navigate("/questionario-insonia", { 
          state: { 
            user: user, 
            formData: formData,
            paymentCompleted: true,
            emailSent: emailSent,
            generatedPassword: randomPassword,
            startFromBeginning: !insomniaAnswers || insomniaAnswers.length === 0,
            continueFromQuestion: insomniaAnswers?.length || 0
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Erro no processamento do pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    // Se não há respostas do questionário, volta para o formulário
    if (!insomniaAnswers || insomniaAnswers.length === 0) {
      navigate("/formulario", { 
        state: { 
          user: user 
        } 
      });
    } else {
      // Se há respostas, volta para o questionário
      navigate("/questionario-insonia", { 
        state: { 
          user: user, 
          formData: formData,
          returnFromPayment: true 
        } 
      });
    }
  };

  if (!user || !formData) {
    return (
      <ErrorContainer>
        <h2>Erro: Dados não encontrados</h2>
        <p>Por favor, complete primeiro o formulário inicial.</p>
        <button onClick={() => navigate("/formulario")}>
          Voltar ao Formulário
        </button>
      </ErrorContainer>
    );
  }

  // Tela de sucesso após pagamento processado
  if (isProcessing && generatedPassword) {
    return (
      <>
        <TopNavbar />
        <SuccessContainer>
          <SuccessContent>
            <SuccessIcon>🎉</SuccessIcon>
            <SuccessTitle>Pagamento Confirmado!</SuccessTitle>
            <SuccessMessage>
              Parabéns <strong>{user.displayName}</strong>! Seu pagamento foi processado com sucesso.
            </SuccessMessage>
            
            <PasswordSection>
              <PasswordTitle>🔐 Sua Senha de Acesso</PasswordTitle>
              <GeneratedPassword>{generatedPassword}</GeneratedPassword>
              <PasswordNote>
                ⚠️ Anote esta senha! Ela foi enviada para seu email: <strong>{user.email}</strong>
              </PasswordNote>
            </PasswordSection>

            <EmailStatus>
              {emailSent ? (
                <EmailSuccess>
                  ✅ Email de confirmação enviado com sucesso!
                </EmailSuccess>
              ) : (
                <EmailPending>
                  📧 Enviando email de confirmação...
                </EmailPending>
              )}
            </EmailStatus>

            <SuccessInfo>
              <InfoItem>✨ Acesso premium ativado</InfoItem>
              <InfoItem>📊 Questionário completo liberado</InfoItem>
              <InfoItem>🏠 Sala de Bem-Estar disponível</InfoItem>
              <InfoItem>📚 Conteúdos exclusivos desbloqueados</InfoItem>
            </SuccessInfo>

            <RedirectMessage>
              Redirecionando para o questionário em alguns segundos...
            </RedirectMessage>
          </SuccessContent>
        </SuccessContainer>
      </>
    );
  }

  return (
    <>
      <PaymentContainer>
        <PaymentWrapper>
          <Header>
            <Title> Pagamento </Title>
          </Header>
          <ServiceInfo>
            <PriceInfo>
              <Price>R$ {servicePrice.toFixed(2).replace('.', ',')}</Price>
              <Installment>à vista no cartão de crédito</Installment>
            </PriceInfo>
          </ServiceInfo>

          <PaymentForm onSubmit={handleSubmit}>
            <SectionTitle>💳 Dados do Cartão de Crédito</SectionTitle>
            
            <FormField>
              <Label>Número do Cartão</Label>
              <Input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
              />
              {errors.cardNumber && <ErrorText>{errors.cardNumber}</ErrorText>}
            </FormField>
            
            <FormRow>
              <FormField>
                <Label>Vencimento</Label>
                <Input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/AA"
                  maxLength="5"
                />
                {errors.expiryDate && <ErrorText>{errors.expiryDate}</ErrorText>}
              </FormField>
              
              <FormField>
                <Label>CVV</Label>
                <Input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}
              </FormField>
            </FormRow>
            
            <FormField>
              <Label>Nome do Portador</Label>
              <Input
                type="text"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleInputChange}
                placeholder="NOME COMO NO CARTÃO"
              />
              {errors.cardholderName && <ErrorText>{errors.cardholderName}</ErrorText>}
            </FormField>
            
            <SecurityInfo>
              🔒 <strong>Transação 100% Segura</strong><br/>
            </SecurityInfo>
            <ButtonGroup>
              <PayButton type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>⏳ Processando Pagamento...</>
                ) : (
                  <>🔓 Finalizar Pagamento - R$ {servicePrice.toFixed(2).replace('.', ',')}</>
                )}
              </PayButton>
            </ButtonGroup>
          </PaymentForm>
        </PaymentWrapper>
      </PaymentContainer>
    </>
  );
}

// Styled Components
const PaymentContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10px 20px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const PaymentWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  
  strong {
    color: #333;
    font-weight: 600;
  }
`;

const ServiceInfo = styled.div`
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  border-left: 5px solid #007bff;
`;

const ServiceTitle = styled.h3`
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const ServiceDescription = styled.div`
  color: #555;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 20px;
`;

const PriceInfo = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 10px;
  border: 2px solid #007bff;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 5px;
`;

const Installment = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PaymentForm = styled.form``;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
`;

const SecurityInfo = styled.div`
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 15px;
  border-radius: 10px;
  margin: 25px 0;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const BackButton = styled.button`
  flex: 1;
  padding: 15px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

const PayButton = styled.button`
  flex: 2;
  padding: 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  padding: 120px 20px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SuccessContent = styled.div`
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 20px;
`;

const SuccessTitle = styled.h1`
  color: #28a745;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.p`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;

  strong {
    color: #28a745;
  }
`;

const PasswordSection = styled.div`
  background: #f8f9fa;
  border: 2px solid #28a745;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
`;

const PasswordTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 15px;
`;

const GeneratedPassword = styled.div`
  background: #28a745;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 3px;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
`;

const PasswordNote = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 10px;

  strong {
    color: #333;
  }
`;

const EmailStatus = styled.div`
  margin: 25px 0;
`;

const EmailSuccess = styled.div`
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
`;

const EmailPending = styled.div`
  color: #007bff;
  font-weight: 600;
  font-size: 1.1rem;
`;

const SuccessInfo = styled.div`
  background: #e8f5e8;
  border-radius: 10px;
  padding: 20px;
  margin: 25px 0;
`;

const InfoItem = styled.div`
  color: #155724;
  font-size: 1rem;
  margin: 8px 0;
  text-align: left;
`;

const RedirectMessage = styled.div`
  color: #666;
  font-style: italic;
  margin-top: 30px;
  font-size: 0.95rem;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  text-align: center;
  padding: 20px;

  h2 {
    color: #dc3545;
    margin-bottom: 20px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;