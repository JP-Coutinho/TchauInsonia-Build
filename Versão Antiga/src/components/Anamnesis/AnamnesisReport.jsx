import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const AnamnesisReport = ({ userProfile, onContinue }) => {
  const navigate = useNavigate();
  
  const generateAnamnesis = () => {
    const { personalData, insomniaAnswers, completionReason } = userProfile;
    
    if (completionReason === "no_insomnia") {
      return {
        title: "Análise Preliminar: Ausência de Critérios para Insônia",
        summary: `Com base nas respostas fornecidas, ${personalData.name} não apresenta os critérios necessários para caracterização de insônia, uma vez que os distúrbios do sono não ocorrem com a frequência mínima de 3 vezes por semana.`,
        recommendations: [
          "Manutenção dos hábitos de sono atuais",
          "Monitoramento preventivo da qualidade do sono",
          "Práticas de higiene do sono como medida preventiva"
        ],
        severity: "normal"
      };
    }
    
    // Análise das respostas para gerar anamnese detalhada
    const analysis = analyzeAnswers(insomniaAnswers);
    const severity = determineSeverity(analysis);
    
    return {
      title: "Anamnese Inicial - Avaliação de Insônia",
      summary: generateSummary(personalData, analysis),
      findings: generateFindings(analysis),
      recommendations: generateRecommendations(severity),
      severity
    };
  };
  
  const analyzeAnswers = (answers) => {
    const analysis = {
      hasInsomnia: false,
      duration: null,
      type: [],
      causes: [],
      impact: null,
      sleepHygiene: null,
      comorbidities: []
    };
    
    answers.forEach(answer => {
      const { questionId, answer: response } = answer;
      
      switch(questionId) {
        case 0:
          analysis.hasInsomnia = response === "Sim";
          break;
        case 1:
          analysis.duration = response;
          break;
        case 4:
          if (response === "Sim") analysis.type.push("Insônia Inicial/Conciliação");
          break;
        case 5:
          if (response === "Sim") analysis.type.push("Insônia de Manutenção");
          break;
        case 6:
          if (response === "Sim") analysis.type.push("Insônia Terminal");
          break;
        case 7:
          if (response === "Sim") analysis.type.push("Insônia Mista/Global");
          break;
        case 8:
          if (response === "Sim") analysis.causes.push("Insônia Primária (eventos impactantes)");
          break;
        case 9:
          if (response === "Sim") analysis.causes.push("Insônia Secundária (patologias/medicamentos)");
          break;
        case 10:
          if (response === "Sim") analysis.causes.push("Transtorno do Ciclo Circadiano");
          break;
        case 11:
          analysis.impact = response === "Sim" ? "Com prejuízos diurnos" : "Sem prejuízos diurnos significativos";
          break;
        case 13:
        case 14:
        case 15:
          if (questionId === 13 && response === "Não") analysis.sleepHygiene = "Horários irregulares";
          if (questionId === 15 && response === "Sim") analysis.sleepHygiene = "Horários completamente irregulares";
          break;
        case 18:
        case 19:
        case 20:
        case 21:
          if (response === "Sim") {
            const comorbidity = getComorbidityByQuestionId(questionId);
            if (comorbidity) analysis.comorbidities.push(comorbidity);
          }
          break;
      }
    });
    
    return analysis;
  };
  
  const getComorbidityByQuestionId = (questionId) => {
    const comorbidities = {
      18: "Distúrbios do sono (pernas inquietas, apneia, pesadelos)",
      19: "Roncopatia/Apneia do sono",
      20: "Doenças sistêmicas",
      21: "Uso de substâncias (álcool, cigarro, drogas)"
    };
    return comorbidities[questionId];
  };
  
  const determineSeverity = (analysis) => {
    if (!analysis.hasInsomnia) return "normal";
    
    let score = 0;
    
    // Duração
    if (analysis.duration && analysis.duration.includes("Mais de 3 meses")) score += 2;
    else score += 1;
    
    // Tipos múltiplos
    if (analysis.type.length > 2) score += 2;
    else if (analysis.type.length > 0) score += 1;
    
    // Prejuízos diurnos
    if (analysis.impact && analysis.impact.includes("Com prejuízos")) score += 2;
    
    // Comorbidades
    score += analysis.comorbidities.length;
    
    // Higiene do sono
    if (analysis.sleepHygiene && analysis.sleepHygiene.includes("completamente")) score += 2;
    else if (analysis.sleepHygiene) score += 1;
    
    if (score >= 6) return "severe";
    if (score >= 3) return "moderate";
    return "mild";
  };
  
  const generateSummary = (personalData, analysis) => {
    const { name, gender, profession, city, state } = personalData;
    const age = calculateAge(personalData.birthDate);
    
    let summary = `${name}, ${age} anos, ${gender}, ${profession}, residente em ${city}/${state}, apresenta quadro compatível com insônia `;
    
    if (analysis.duration) {
      summary += analysis.duration.includes("Mais de 3 meses") ? "crônica " : "aguda ";
    }
    
    if (analysis.type.length > 0) {
      summary += `do tipo: ${analysis.type.join(", ")}. `;
    }
    
    if (analysis.impact) {
      summary += `Paciente relata ${analysis.impact.toLowerCase()}. `;
    }
    
    return summary;
  };
  
  const generateFindings = (analysis) => {
    const findings = [];
    
    if (analysis.causes.length > 0) {
      findings.push(`Possíveis causas identificadas: ${analysis.causes.join(", ")}`);
    }
    
    if (analysis.sleepHygiene) {
      findings.push(`Higiene do sono: ${analysis.sleepHygiene}`);
    }
    
    if (analysis.comorbidities.length > 0) {
      findings.push(`Comorbidades identificadas: ${analysis.comorbidities.join(", ")}`);
    }
    
    return findings;
  };
  
  const generateRecommendations = (severity) => {
    const baseRecommendations = [
      "Avaliação médica especializada em Medicina do Sono",
      "Implementação de técnicas de higiene do sono",
      "Manutenção de diário do sono por 2 semanas"
    ];
    
    switch(severity) {
      case "severe":
        return [
          "Encaminhamento URGENTE para especialista em Medicina do Sono",
          "Possível necessidade de polissonografia",
          "Avaliação de comorbidades médicas e psiquiátricas",
          ...baseRecommendations
        ];
      case "moderate":
        return [
          "Consulta com especialista em Medicina do Sono em até 30 dias",
          "Início de terapia cognitivo-comportamental para insônia (TCC-I)",
          ...baseRecommendations
        ];
      default:
        return baseRecommendations;
    }
  };
  
  const calculateAge = (birthDate) => {
    if (!birthDate) return "idade não informada";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  
  const anamnesis = generateAnamnesis();
  
  const getSeverityColor = (severity) => {
    switch(severity) {
      case "severe": return "#dc3545";
      case "moderate": return "#ffc107";
      case "mild": return "#28a745";
      default: return "#17a2b8";
    }
  };
  
  const getSeverityLabel = (severity) => {
    switch(severity) {
      case "severe": return "Grave - Necessita Atenção Urgente";
      case "moderate": return "Moderada - Requer Acompanhamento";
      case "mild": return "Leve - Monitoramento Recomendado";
      default: return "Padrão Normal";
    }
  };
  
  return (
    <ReportContainer>
      <Header>
        <Title>{anamnesis.title}</Title>
        <SeverityBadge severity={anamnesis.severity}>
          {getSeverityLabel(anamnesis.severity)}
        </SeverityBadge>
      </Header>
      
      <Content>
        <Section>
          <SectionTitle>Resumo Clínico</SectionTitle>
          <SummaryText>{anamnesis.summary}</SummaryText>
        </Section>
        
        {anamnesis.findings && (
          <Section>
            <SectionTitle>Achados Principais</SectionTitle>
            <FindingsList>
              {anamnesis.findings.map((finding, index) => (
                <FindingItem key={index}>{finding}</FindingItem>
              ))}
            </FindingsList>
          </Section>
        )}
        
        <Section>
          <SectionTitle>Recomendações Iniciais</SectionTitle>
          <RecommendationsList>
            {anamnesis.recommendations.map((rec, index) => (
              <RecommendationItem key={index}>{rec}</RecommendationItem>
            ))}
          </RecommendationsList>
        </Section>
        
        <ImportantNotice>
          <NoticeTitle>⚠️ IMPORTANTE - AVISO MÉDICO</NoticeTitle>
          <NoticeText>
            <strong>Esta é uma anamnese inicial automatizada baseada em questionário padronizado.</strong>
            <br /><br />
            • Este relatório representa um <strong>estágio primário de avaliação</strong> e não substitui consulta médica presencial
            <br />
            • Os dados coletados serão <strong>encaminhados a um médico especialista</strong> para análise detalhada
            <br />
            • O diagnóstico definitivo e tratamento adequado só podem ser estabelecidos por profissional médico habilitado
            <br />
            • Em caso de sintomas graves ou emergenciais, procure atendimento médico imediatamente
          </NoticeText>
        </ImportantNotice>
        
        <ButtonContainer>
          <ContinueButton onClick={onContinue}>
            Prosseguir para Perfil
          </ContinueButton>
        </ButtonContainer>
      </Content>
    </ReportContainer>
  );
};

// Styled Components
const ReportContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const SeverityBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: ${props => props.severity === 'severe' ? '#dc3545' : 
                              props.severity === 'moderate' ? '#ffc107' : 
                              props.severity === 'mild' ? '#28a745' : '#17a2b8'};
  color: ${props => props.severity === 'moderate' ? '#000' : '#fff'};
`;

const Content = styled.div`
  padding: 30px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #007bff;
`;

const FindingsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FindingItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
  color: #666;
  
  &:before {
    content: "📋 ";
    margin-right: 8px;
  }
`;

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecommendationItem = styled.li`
  background: #e8f5e8;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: #2d5a2d;
  border-left: 4px solid #28a745;
  
  &:before {
    content: "✓ ";
    font-weight: bold;
    color: #28a745;
    margin-right: 8px;
  }
`;

const ImportantNotice = styled.div`
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 10px;
  padding: 25px;
  margin: 30px 0;
`;

const NoticeTitle = styled.h4`
  color: #856404;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const NoticeText = styled.p`
  color: #856404;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const ContinueButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
  }
`;

export default AnamnesisReport;