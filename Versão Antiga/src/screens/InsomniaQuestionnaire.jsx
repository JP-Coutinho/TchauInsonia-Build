import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Nav/TopNavbar";
import Question from "../components/Forms/Question";
import ProgressBar from "../components/Forms/ProgressBar";
import AnamnesisReport from "../components/Anamnesis/AnamnesisReport";

// Estrutura de perguntas com lógica condicional
const questionStructure = {
  // Pergunta 1 - Frequência da insônia
  0: {
    question: "A sua insatisfação com o sono acontece 3 ou mais vezes por semana?",
    nextYes: 1, 
    responseYes: "De fato, sabemos que a insônia, para ser considerada como tal deve acontecer ao menos 3 vezes por semana. É seu caso.",
    responseNo: "Sem resposta.",
    nextNo: "end_no_insomnia" 
  },
  
  // Pergunta 2 - Duração da insônia
  1: {
    question: "O seu problema com o sono está acontecendo há mais de 3 meses?",
    nextYes: 2,
    nextNo: 3,
    responseYes: "Quando a insônia tem mais de 3 meses de evolução, estamos diante de um quadro de insônia crônica.",
    responseNo: "Com tempo de evolução menor que 3 meses, estamos diante de um quadro de insônia aguda."
  },
  
  // Pergunta 3 - Tipos de insônia (múltipla escolha)
  2: {
    question: "Escolha uma ou mais opções das três alternativas seguintes:",
    type: "multiple_choice",
    options: [
      {
        id: "inicial", 
        text: "Tenho dificuldade para conciliar (iniciar) o sono.",
        response: "Se o seu problema é a dificuldade de começar a dormir, estamos falando de uma insônia inicial ou de conciliação."
      },
      {
        id: "manutencao", 
        text: "Acordo mais de duas vezes durante a noite.",
        response: "Se o seu problema é a dificuldade de se manter dormindo (acorda mais de 2 vezes na noite), estamos falando de uma insônia de manutenção."
      },
      {
        id: "terminal", 
        text: "Costumo perder o sono antes da hora prevista para acordar.",
        response: "Se o seu problema é despertar ou perder o sono antes do horário previsto, então estamos falando da chamada insônia terminal."
      }
    ],
    next: 4
  },
  
  // Para insônia aguda, vai direto para tipos de insônia
  3: {
    question: "Escolha uma ou mais opções das três alternativas seguintes:",
    type: "multiple_choice",
    options: [
      {
        id: "inicial", 
        text: "Tenho dificuldade para conciliar (iniciar) o sono.",
        response: "Se o seu problema é a dificuldade de começar a dormir, estamos falando de uma insônia inicial ou de conciliação."
      },
      {
        id: "manutencao", 
        text: "Acordo mais de duas vezes durante a noite.",
        response: "Se o seu problema é a dificuldade de se manter dormindo (acorda mais de 2 vezes na noite), estamos falando de uma insônia de manutenção."
      },
      {
        id: "terminal", 
        text: "Costumo perder o sono antes da hora prevista para acordar.",
        response: "Se o seu problema é despertar ou perder o sono antes do horário previsto, então estamos falando da chamada insônia terminal."
      }
    ],
    next: 4
  },
  
  // Pergunta 4 - Continuação do questionário (você pode adicionar mais perguntas conforme necessário)
  4: {
    question: "Você apresenta mais de um tipo de insônia? Se não tem comprometimento em todas as fases do sono e a noite toda, você tem a denominada insônia mista. Mas, se o comprometimento do sono atinge níveis mais amplos, você padece da chamada insônia global. É seu caso?",
    next: 5
  },
  
  // Pergunta 5 - Causas da insônia
  5: {
    question: "Quando a insônia ocorre a raiz de um determinado evento impactante como um abalo psicológico por problemas pessoais, familiares, econômicos ou de trabalho, algum acidente ou mudança brusca no cotidiano, dizemos que a insônia é primária. É o seu caso?",
    next: 6
  },
  
  6: {
    question: "Quando a insônia é decorrente de outra patologia física ou mental, ou surgiu a partir do uso de algum medicamento ou droga, dizemos que a insônia é secundária. É o seu caso?",
    next: 7
  },
  
  7: {
    question: "Quando mudamos bruscamente de fuso horário ou nos vemos forçados a mudar nosso horário de dormir, desregula-se o nosso relógio biológico e ocorre a insônia por transtorno do ciclo circadiano. É o seu caso?",
    next: 8
  },
  
  // Pergunta 8 - Impacto diurno
  8: {
    question: "O fato de você ter prejuízos diurnos decorrentes da insônia é um alerta expressivo da necessidade urgente de tratar o problema. Você tem prejuízos diurnos?",
    nextYes: 10, // Pula pergunta 9 se tem prejuízos diurnos
    nextNo: 9
  },
  
  9: {
    question: "Se a sua insônia ainda não chegou a níveis que comprometam suas atividades no dia a dia, devemos considerar que estamos diante de uma excelente oportunidade para pôr fim a um problema. Sua insônia ainda não compromete suas atividades diárias?",
    next: 10
  },
  
  // Pergunta 10 - Horários de sono
  10: {
    question: "Indiscutivelmente se pretendemos ter uma boa noite de sono, prevenir ou tratar a insônia, é fundamental termos a disciplina de observar um rígido horário para deitar e para despertar. Você mantém horários regulares para dormir e acordar?",
    nextYes: 13, // Se mantém horários regulares, pula próximas perguntas
    nextNo: 11
  },
  
  11: {
    question: "É fundamental termos a disciplina de observar um rígido horário para deitar e para despertar. O horário destinado ao sono deve ser 'sagrado'. Você tem dificuldades para manter horários regulares?",
    nextYes: 12,
    nextNo: 13
  },
  
  12: {
    question: "Alerta vermelho! Indiscutivelmente se pretendemos ter uma boa noite de sono, prevenir ou tratar a insônia, é fundamental termos a disciplina de observar um rígido horário para deitar e para despertar. Seus horários de sono são completamente irregulares?",
    next: 13
  },
  
  // Pergunta 13 - Continuação das perguntas
  13: {
    question: "Quando surgem evidências ou suspeitas robustas de que a pessoa dormiu de forma contínua e por um período razoável, porém ela tem a nítida impressão ou a certeza de que dormiu muito pouco, é preciso considerarmos também a hipótese diagnóstica da insônia paradoxal. É o seu caso?",
    next: 14
  },
  
  14: {
    question: "A preocupação excessiva com o sono, com a insônia e/ou com suas consequências, é muito prejudicial. Este tipo de preocupações ou inquietações leva à inibição psicobiológica e até à 'síndrome do esforço do sono'. Você tem preocupação excessiva com o sono?",
    next: 15
  },
  
  15: {
    question: "Algumas doenças como a Síndrome das pernas inquietas, afecções que provoquem algum grau de angústia respiratória durante o sono, Síndrome de Apneia Hipopneia Obstrutiva do Sono e pesadelos podem provocar despertares frequentes e dar origem a um quadro de insônia. Você tem alguma dessas condições?",
    next: 16
  },
  
  16: {
    question: "Frequentemente a roncopatia e as apneias do sono levam a desarranjos na arquitetura do sono e micro despertares, podendo provocar insônia. Você ronca ou tem apneia do sono?",
    next: 17
  },
  
  17: {
    question: "Sabidamente, muitas doenças sistêmicas são capazes de levar à insônia, ou também podem ser desencadeadas ou agravadas por esta. A maioria das vezes coexistem formando um círculo vicioso onde uma agrava a outra e vice-versa. Você tem alguma doença sistêmica?",
    next: 18
  },
  
  18: {
    question: "Conforme estudamos anteriormente, o consumo de álcool, cigarro e drogas é altamente nocivo para a saúde em geral e particularmente para o sono. Você consome álcool, cigarro ou outras drogas regularmente?",
    next: "end"
  }
};

export default function InsomniaQuestionnaire() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, formData } = location.state || {};
  
  // Verificar se está retornando do pagamento para continuar de onde parou
  const returnFromPayment = location.state?.returnFromPayment;
  const continueFromQuestion = location.state?.continueFromQuestion || 0;
  const paymentCompleted = location.state?.paymentCompleted;
  const startFromBeginning = location.state?.startFromBeginning;
  
  const [currentQuestionId, setCurrentQuestionId] = useState(
    (returnFromPayment && !startFromBeginning) ? continueFromQuestion : 0
  );
  const [answers, setAnswers] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState(
    (returnFromPayment && !startFromBeginning) ? [continueFromQuestion] : [0]
  );
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [showAnamnesis, setShowAnamnesis] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const getCurrentQuestion = () => {
    return questionStructure[currentQuestionId];
  };

  const handleAnswer = (answer) => {
    const currentQ = getCurrentQuestion();
    
    // Para perguntas de múltipla escolha, answer será um array
    let answerText = answer;
    let contextualResponse = "";
    
    if (currentQ.type === "multiple_choice" && Array.isArray(answer)) {
      // Concatenar as respostas selecionadas e suas explicações
      const selectedOptions = answer.map(selectedId => 
        currentQ.options.find(opt => opt.id === selectedId)
      );
      
      answerText = selectedOptions.map(opt => opt.text).join("; ");
      contextualResponse = selectedOptions.map(opt => opt.response).join(" ");
    } else if (currentQ.responseYes && currentQ.responseNo) {
      // Para perguntas sim/não com respostas contextuais
      contextualResponse = answer === "Sim" ? currentQ.responseYes : currentQ.responseNo;
    }
    
    const newAnswer = { 
      questionId: currentQuestionId,
      question: currentQ.question, 
      answer: answerText,
      contextualResponse: contextualResponse,
      questionNumber: visitedQuestions.length
    };
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    
    // Verificar se usuário tem acesso pago
    const paymentCompleted = localStorage.getItem('accessGranted') === 'true';
    
    // Se não tem acesso pago e não veio do pagamento, bloquear acesso
    if (!paymentCompleted && !location.state?.paymentCompleted && !location.state?.returnFromPayment) {
      navigate("/pagamento", { 
        state: { 
          user: user, 
          formData: formData,
          insomniaAnswers: newAnswers,
          accessDenied: true
        } 
      });
      return;
    }
    
    // Determinar próxima pergunta baseada na resposta
    let nextQuestionId = null;
    
    if (currentQuestionId === 0) {
      // Pergunta inicial sobre frequência da insônia
      if (answer === "Não") {
        handleSubmitQuestionnaire(newAnswers, "no_insomnia");
        return;
      } else {
        nextQuestionId = 1;
      }
    } else if (currentQ.nextYes && currentQ.nextNo) {
      // Pergunta com roteamento condicional
      nextQuestionId = answer === "Sim" ? currentQ.nextYes : currentQ.nextNo;
    } else {
      // Pergunta com próxima fixa
      nextQuestionId = currentQ.next;
    }
    
    if (nextQuestionId === "end") {
      handleSubmitQuestionnaire(newAnswers);
    } else if (typeof nextQuestionId === "number") {
      setCurrentQuestionId(nextQuestionId);
      setVisitedQuestions([...visitedQuestions, nextQuestionId]);
      setTotalQuestions(Math.max(totalQuestions, visitedQuestions.length + 1));
    }
  };



  const handlePrevious = () => {
    if (visitedQuestions.length > 1) {
      // Remove a última pergunta visitada
      const newVisitedQuestions = visitedQuestions.slice(0, -1);
      const previousQuestionId = newVisitedQuestions[newVisitedQuestions.length - 1];
      
      setCurrentQuestionId(previousQuestionId);
      setVisitedQuestions(newVisitedQuestions);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleSubmitQuestionnaire = (finalAnswers, reason = "completed") => {
    // Salvar todas as respostas
    const completeProfile = {
      personalData: formData,
      insomniaAnswers: finalAnswers,
      completedAt: new Date().toISOString(),
      completionReason: reason,
      formCompleted: true
    };
    
    localStorage.setItem('completeUserProfile', JSON.stringify(completeProfile));
    
    // Também gravar flag específico para facilitar verificação
    localStorage.setItem('insomniaQuestionnaireCompleted', 'true');
    
    console.log("✅ Perfil completo e questionário finalizado:", completeProfile);
    
    // Definir perfil e mostrar anamnese
    setUserProfile(completeProfile);
    setShowAnamnesis(true);
  };

  const handleAnamnesisComplete = () => {
    let message = "Anamnese inicial gerada com sucesso!";
    
    if (userProfile?.completionReason === "no_insomnia") {
      message = "Análise concluída. Seus dados foram registrados para acompanhamento preventivo.";
    }
    
    // Redirecionar para dashboard/perfil
    navigate("/perfil", { 
      state: { 
        user: user, 
        profileComplete: true,
        message: message,
        hasAnamnesis: true
      } 
    });
  };

  // Verificar se usuário tem dados necessários
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

  // Verificar se usuário tem acesso pago (exceto se acabou de pagar)
  const hasAccessGranted = localStorage.getItem('accessGranted') === 'true';
  const comingFromPayment = location.state?.paymentCompleted || location.state?.returnFromPayment;
  
  if (!hasAccessGranted && !comingFromPayment) {
    return (
      <ErrorContainer>
        <h2>🔒 Acesso Premium Necessário</h2>
        <p>Para acessar o questionário completo de avaliação da insônia, é necessário ter uma conta premium.</p>
        <button onClick={() => navigate("/pagamento", { 
          state: { 
            user: user, 
            formData: formData,
            accessDenied: true 
          } 
        })}>
          Fazer Upgrade Premium
        </button>
      </ErrorContainer>
    );
  }

  if (showAnamnesis && userProfile) {
    return (
      <>
        <TopNavbar />
        <AnamnesisContainer>
          <AnamnesisReport 
            userProfile={userProfile} 
            onContinue={handleAnamnesisComplete}
          />
        </AnamnesisContainer>
      </>
    );
  }

  return (
    <>
      <TopNavbar />
      <QuestionnaireContainer>
        <HeaderSection>
          <Title>Questionário de Avaliação da Insônia</Title>
          <Subtitle>
            {paymentCompleted ? (
              <>
                🎉 <strong>Pagamento confirmado!</strong> Agora você tem acesso completo à avaliação. 
                Vamos {startFromBeginning ? 'começar' : 'continuar'} com o questionário detalhado, <strong>{user.displayName}</strong>!
              </>
            ) : (
              <>
                Olá <strong>{user.displayName}</strong>! Agora vamos avaliar seu perfil de sono com perguntas específicas sobre insônia.
              </>
            )}
          </Subtitle>
        </HeaderSection>
        
        <ProgressBar current={visitedQuestions.length} total={Math.max(totalQuestions, 10)} />
        
        {getCurrentQuestion().type === "multiple_choice" ? (
          <MultipleChoiceQuestion 
            question={getCurrentQuestion().question}
            options={getCurrentQuestion().options}
            onAnswer={handleAnswer}
          />
        ) : (
          <Question
            question={getCurrentQuestion().question}
            onAnswer={handleAnswer}
          />
        )}
        
        <NavigationSection>
          {visitedQuestions.length > 1 && (
            <PreviousButton onClick={handlePrevious}>
              ← Pergunta Anterior
            </PreviousButton>
          )}
          <QuestionCounter>
            Pergunta {visitedQuestions.length} (Questionário Adaptativo)
          </QuestionCounter>
        </NavigationSection>
      </QuestionnaireContainer>
    </>
  );
}

// Styled Components
const QuestionnaireContainer = styled.div`
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 120px 20px 40px;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: none;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const NavigationSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

const PreviousButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: 2px solid #6c757d;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5a6268;
    border-color: #5a6268;
    transform: translateY(-2px);
  }
`;

const QuestionCounter = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
`;

// Componente para perguntas de múltipla escolha
const MultipleChoiceQuestion = ({ question, options, onAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      onAnswer(selectedOptions);
    }
  };

  return (
    <QuestionContainer>
      <QuestionText>{question}</QuestionText>
      <OptionsContainer>
        {options.map((option) => (
          <OptionCheckbox key={option.id}>
            <input
              type="checkbox"
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionToggle(option.id)}
            />
            <label htmlFor={option.id}>
              {option.text}
            </label>
          </OptionCheckbox>
        ))}
      </OptionsContainer>
      <SubmitButton 
        onClick={handleSubmit}
        disabled={selectedOptions.length === 0}
      >
        Confirmar Seleção{selectedOptions.length > 0 ? ` (${selectedOptions.length} item${selectedOptions.length > 1 ? 's' : ''})` : ''}
      </SubmitButton>
    </QuestionContainer>
  );
};

const QuestionContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const QuestionText = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 30px;
  line-height: 1.6;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  text-align: left;
`;

const OptionCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #007bff;
    background-color: #f8f9ff;
  }

  input[type="checkbox"] {
    margin: 0;
    width: 18px;
    height: 18px;
    accent-color: #007bff;
    cursor: pointer;
  }

  label {
    flex: 1;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.5;
    color: #333;
    font-weight: 500;
  }

  &:has(input:checked) {
    border-color: #007bff;
    background-color: #e3f2fd;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  border: 2px solid #007bff;
  border-radius: 10px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;

  &:disabled {
    background-color: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AnamnesisContainer = styled.div`
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 120px 20px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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