// src/pages/SleepProfileForm.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "recharts";
import styled from "styled-components";
import { 
  fetchStates, 
  fetchCitiesByState, 
  formatCPF, 
  formatWhatsApp, 
  validateCPF, 
  formatCEP, 
  fetchAddressByCEP 
} from "../../services/ibgeApi";

const SleepProfileForm = ({ displayName, email }) => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: displayName || "",
    email: email || "",
    sleepDuration: "",
    bedtime: "",
    identification: "",
    cep: "",
    city: "",
    state: "",
    street: "",
    neighborhood: "",
    whatsapp: "",
    profession: "",
    sleepComplaint: "",
  });

  // Estados para controle das APIs e validações
  const [availableCities, setAvailableCities] = useState([]);
  const [cpfError, setCpfError] = useState("");
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cepError, setCepError] = useState("");
  const [selectedStateData, setSelectedStateData] = useState(null);

  const handleModalClose = () => {
    setShowModal(false);
    // Redirecionar para a página de pagamento após completar o formulário inicial
    navigate("/pagamento", { state: { user: { displayName, email }, formData } });
  };

  const [showModal, setShowModal] = useState(false);

  const [currentBlock, setCurrentBlock] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);

  // Verificar se usuário já tem acesso pago
  useEffect(() => {
    const accessGranted = localStorage.getItem('accessGranted') === 'true';
    setHasAccess(accessGranted);
  }, []);

  useEffect(() => {
    // Carregar dados existentes do localStorage se disponíveis
    const existingFormData = localStorage.getItem('sleepProfileFormData');
    
    if (existingFormData) {
      try {
        const parsedData = JSON.parse(existingFormData);
        setFormData((prevState) => ({
          ...parsedData,
          name: displayName || parsedData.name,
          email: email || parsedData.email
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do formulário:', error);
      }
    } else if (displayName && email) {
      setFormData((prevState) => ({
        ...prevState,
        name: displayName,
        email: email
      }));
    }
  }, [displayName, email]);

  // Carregar estados da API do IBGE ao montar componente
  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        console.log('🌍 Carregando estados do Brasil via API IBGE...');
        const statesData = await fetchStates();
        setStates(statesData);
        console.log('✅ Estados carregados:', statesData.length, 'estados');
      } catch (error) {
        console.error('❌ Erro ao carregar estados:', error);
        // Fallback será usado automaticamente pela função fetchStates
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Aplicar máscaras conforme o campo
    if (name === 'identification') {
      formattedValue = formatCPF(value);
      // Validar CPF em tempo real
      if (formattedValue.length === 14) { // CPF completo: 000.000.000-00
        if (validateCPF(formattedValue)) {
          setCpfError("");
        } else {
          setCpfError("CPF inválido");
        }
      } else {
        setCpfError("");
      }
    } else if (name === 'whatsapp') {
      formattedValue = formatWhatsApp(value);
    } else if (name === 'state') {
      // Encontrar dados completos do estado selecionado
      const stateData = states.find(state => state.id.toString() === value);
      setSelectedStateData(stateData);
      console.log('🏛️ Estado selecionado:', stateData?.name, '(' + stateData?.code + ')');
      
      // Carregar cidades do estado selecionado
      loadCitiesForState(value);
      
      // Limpar cidade selecionada quando estado muda
      setFormData((prevState) => ({
        ...prevState,
        city: "",
        [name]: formattedValue
      }));
      return;
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
      // Auto-completar endereço se CEP estiver completo
      if (formattedValue.replace(/\D/g, '').length === 8) {
        handleCEPSearch(formattedValue);
      } else {
        setCepError("");
      }
    }
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue
    }));
  };

  // Função para carregar cidades por estado via API IBGE
  const loadCitiesForState = async (stateId) => {
    if (!stateId) {
      setAvailableCities([]);
      return;
    }

    try {
      setLoadingCities(true);
      console.log('🏙️ Carregando cidades para estado ID:', stateId);
      const cities = await fetchCitiesByState(stateId);
      setAvailableCities(cities);
      console.log('✅ Cidades carregadas:', cities.length, 'cidades');
    } catch (error) {
      console.error('❌ Erro ao carregar cidades:', error);
      setAvailableCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Função para buscar endereço por CEP e preencher automaticamente
  const handleCEPSearch = async (cep) => {
    try {
      setCepError("");
      console.log('📮 Buscando CEP:', cep);
      const address = await fetchAddressByCEP(cep);
      console.log('✅ Endereço encontrado:', address);
      
      // Encontrar o estado correspondente na lista carregada
      const selectedState = states.find(state => state.code === address.state);
      if (selectedState) {
        console.log('🎯 Auto-preenchendo com dados do CEP');
        setSelectedStateData(selectedState);
        
        // Carregar cidades do estado
        await loadCitiesForState(selectedState.id);
        
        // Aguardar um pouco para as cidades carregarem
        setTimeout(() => {
          // Atualizar formulário com dados do CEP
          setFormData((prevState) => ({
            ...prevState,
            state: selectedState.id.toString(),
            city: address.city,
            street: address.street || prevState.street,
            neighborhood: address.neighborhood || prevState.neighborhood
          }));
        }, 500);
      }
    } catch (error) {
      setCepError("CEP não encontrado ou inválido");
      console.error('❌ Erro ao buscar CEP:', error);
    }
  };

  const validateBlockFields = (blockIndex = currentBlock) => {
    // Lista de campos obrigatórios por bloco
    const requiredFieldsByBlock = [
      ['name', 'email', 'gender', 'birthDate'],
      ['identification', 'city', 'state'],
      ['profession', 'whatsapp', 'sleepComplaint']
    ];
    const requiredFields = requiredFieldsByBlock[blockIndex];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    // Validação especial para CPF no bloco 2
    if (blockIndex === 1 && formData.identification) {
      if (!validateCPF(formData.identification)) {
        setCpfError("CPF inválido");
        return false;
      }
    }
    
    if (missingFields.length > 0) {
      console.log('Campos obrigatórios faltando:', missingFields);
    }
    return requiredFields.every(field => formData[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    
    // Adicionar flag de conclusão
    const completeFormData = {
      ...formData,
      completedAt: new Date().toISOString(),
      formCompleted: true
    };
    
    localStorage.setItem('sleepProfileFormData', JSON.stringify(completeFormData));
    localStorage.setItem('personalDataFormCompleted', 'true');
    
    console.log("✅ Formulário de dados pessoais concluído:", completeFormData);
    setShowModal(true); // Exibir modal de agradecimento
  };

  const handleNextBlock = () => {
    if (!validateBlockFields()) {
      alert('Por favor, preencha todos os campos obrigatórios deste bloco antes de continuar.');
      return;
    }
    if (currentBlock === 2) {
      // Salva os dados do formulário em cache ao finalizar o bloco 3
      localStorage.setItem('sleepProfileFormData', JSON.stringify(formData));
    }
    setCurrentBlock((prevBlock) => prevBlock + 1);
  };

  const handlePreviousBlock = () => {
    setCurrentBlock((prevBlock) => prevBlock - 1);
  };

  const blocks = [
    // Bloco 1
    (
      <>
      <Question>
      <label>Nome</label>
      <StyledInput
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Nome"
      required
      readOnly
      />
      </Question>
      <Question>
      <label>E-mail</label>
      <StyledInput
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="E-mail"
      required
      readOnly
      />
      </Question>
      <Question>
        <label>CPF / Identidade</label>
        <StyledInput
        type="text"
        name="identification"
        value={formData.identification || ""}
        onChange={handleChange}
        placeholder="000.000.000-00"
        required
        maxLength={14}
        />
        {cpfError && <ErrorText>{cpfError}</ErrorText>}
      </Question>
      </>
    ),
    // Bloco 2
    // (
    //   <>
    //   {/* <Question>
    //     <label>Cidade onde mora</label>
    //     <StyledSelect
    //     name="city"
    //     value={formData.city || ""}
    //     onChange={handleChange}
    //     required
    //     disabled={!formData.state || loadingCities}
    //     >
    //       <option value="">
    //         {loadingCities ? "🏙️ Carregando cidades..." : "Selecione sua cidade"}
    //       </option>
    //       {availableCities.map((city) => (
    //         <option key={city.id} value={city.name}>
    //           {city.name}
    //         </option>
    //       ))}
    //     </StyledSelect>
    //     {!formData.state && <HelpText>👆 Selecione primeiro o estado</HelpText>}
    //     {loadingCities && <LoadingText>Carregando {selectedStateData?.name || 'cidades'}</LoadingText>}
    //     {availableCities.length > 0 && !loadingCities && (
    //       <HelpText>✅ {availableCities.length} cidades disponíveis</HelpText>
    //     )}
    //   </Question> */}
    //   {/* <Question>
    //     <label>CEP (Opcional - para preenchimento automático)</label>
    //     <StyledInput
    //     type="text"
    //     name="cep"
    //     value={formData.cep || ""}
    //     onChange={handleChange}
    //     placeholder="00000-000"
    //     maxLength={9}
    //     />
    //     {cepError && <ErrorText>{cepError}</ErrorText>}
    //     <HelpText>Digite o CEP para preencher automaticamente cidade e estado</HelpText>
    //   </Question>
    //   <Question>
    //     <label>Estado</label>
    //     <StyledSelect
    //     name="state"
    //     value={formData.state || ""}
    //     onChange={handleChange}
    //     required
    //     disabled={loadingStates}
    //     >
    //       <option value="">
    //         {loadingStates ? "🌍 Carregando estados do Brasil..." : "Selecione seu estado"}
    //       </option>
    //       {states.map((state) => (
    //         <option key={state.id} value={state.id}>
    //           {state.name} ({state.code})
    //         </option>
    //       ))}
    //     </StyledSelect>
    //     {loadingStates && <LoadingText>Buscando dados do IBGE</LoadingText>}
    //   </Question> */}
    //   </>
    // ),
  ];

  return (
    <PageWrapper>
      <FormWrapper>
        {hasAccess && (
          <AccessMessage>
            <h3>🎉 Bem-vindo de volta, {displayName}!</h3>
            <p>Você já tem acesso premium à plataforma. Pode ir direto para o questionário de avaliação ou atualizar seus dados abaixo.</p>
            <QuickAccessButton onClick={() => navigate("/questionario-insonia", { 
              state: { 
                user: { displayName, email }, 
                formData: formData,
                paymentCompleted: true 
              } 
            })}>
              🚀 Ir para Questionário de Avaliação
            </QuickAccessButton>
          </AccessMessage>
        )}
        
        <Introduction>
          <p> Vamos dar um "TCHAU INSÔNIA". </p>
          <p> {hasAccess ? 'Você pode atualizar seus dados abaixo se necessário:' : 'Preencha os dados necessários para a compra do programa. Obs.: Todos os campos são obrigatórios.'} </p>
        </Introduction>
        <Form onSubmit={handleSubmit}>
          {blocks[currentBlock]}
          <NavigationButtons>
            {currentBlock > 0 && (
              <PrevButton type="button" onClick={handlePreviousBlock}>
                Voltar
              </PrevButton>
            )}
            {currentBlock < blocks.length - 1 ? (
              <NextButton type="button" onClick={handleNextBlock}>
                Continuar
              </NextButton>
            ) : (
              <SubmitButton type="submit">Enviar</SubmitButton>
            )}
          </NavigationButtons>
        </Form>
      </FormWrapper>
      {/* Modal de Agradecimento */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Cadastro Realizado com Sucesso! 🎉</h2>
            <p>Seus dados foram salvos. Para ter acesso completo à avaliação personalizada da insônia e todas as funcionalidades premium da plataforma, é necessário realizar o pagamento.</p>
            <Button onClick={handleModalClose}>Continuar para Pagamento</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
  padding-top: 100px; // Espaço para o menu superior
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const AccessMessage = styled.div`
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  text-align: center;
  
  h3 {
    margin: 0 0 15px 0;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0 0 20px 0;
    font-size: 1rem;
    opacity: 0.95;
  }
`;

const QuickAccessButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const Introduction = styled.div`
  margin-bottom: 20px;
  font-size: 1rem;
  color: #333;
  text-align: center;
`;

const Form = styled.form``;

const Question = styled.div`
  margin-bottom: 20px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #333;
  background: #f2f2f2;
  border-radius: 6px;
  padding: 6px 12px;
`;

const Explanation = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  width: 95%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const PrevButton = styled.button`
  padding: 0.8rem;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const NextButton = styled.button`
  padding: 0.8rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
`;

const HelpText = styled.span`
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
  font-style: italic;
`;

const LoadingText = styled.span`
  color: #007bff;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
  font-style: italic;
  
  &::after {
    content: "...";
    animation: dots 1.5s steps(5, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% {
      color: rgba(0,0,0,0);
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);
    }
    40% {
      color: #007bff;
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);
    }
    60% {
      text-shadow:
        .25em 0 0 #007bff,
        .5em 0 0 rgba(0,0,0,0);
    }
    80%, 100% {
      text-shadow:
        .25em 0 0 #007bff,
        .5em 0 0 #007bff;
    }
  }
`;

export default SleepProfileForm;
