import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer } from "recharts";
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import { FaCoffee, FaBed, FaClock, FaSmog } from "react-icons/fa";
import { 
  Wrapper,  Title, ProfileContainer, ProfileCard, 
  ProfileDetails, Detail, HistoryCard, HistoryItem, 
  Recommendation, DistributionCard, ContentWrapper, Legend, 
  LegendItem, ColorBox, CenteredButton, Spacer, ModalOverlay, 
  Modal, ModalTitle, ModalInput, MoodSelect, Button, GraphTitle,
  GuidelineCard, LegendGraph, LegendItemGraph, ContactSection,
  CalendarContainer, Dot, ScheduleButton, GuidelinesCard,GuidelinesList, 
  IconWrapper,  ChatContainer, LastInteraction, 
  StyledSelect} from "./styles";

  
// Dados do gráfico de linha
const lineData = Array.from({ length: 30 }, (_, index) => ({
  day: `Dia ${index + 1}`,
  hours: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
}));

// Função para calcular idade a partir da data de nascimento no formato dd/mm/yyyy
function getAgeFromBirthdate(birthdate) {
  if (!birthdate) return "";
  const [year, month, day] = birthdate.split("-").map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Exemplo: supondo que sleepProfileFormData está disponível no escopo
// Recebe a birthdate como prop
const sleepProfileFormData = JSON.parse(localStorage.getItem("sleepProfileFormData") || "{}");
const birthDate = sleepProfileFormData?.birthDate || "01/01/2000";
const age = getAgeFromBirthdate(birthDate);
console.log("aquii",sleepProfileFormData); // Data de nascimento no formato dd/mm/yyyy


var happySleep = lineData.filter(entry => entry.hours >= 7);
const neutralSleep = lineData.filter(entry => entry.hours >= 6 && entry.hours < 7);
var wrongSleep = lineData.filter(entry => entry.hours < 6);

const pieData = [
  { name: "Feliz", value: happySleep.length, fill: "#4caf50" },
  { name: "Neutro", value: neutralSleep.length, fill: "#ff9800" },
  { name: "Triste", value: wrongSleep.length, fill: "#f44336" },
];
export default function Dashboard({displayName, email}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [mood, setMood] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [agendamentoModalOpen, setAgendamentoModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [patientQuestion, setPatientQuestion] = useState("");
  const [lastQuestion] = useState("Qual a melhor rotina para dormir?");
  const [lastAnswer] = useState("Uma rotina regular e relaxante é ideal.");
  const [generalGuidelines] = useState([
    { text: "Evite cafeína algumas horas antes de dormir.", icon: <FaCoffee /> },
    { text: "Mantenha um ambiente escuro e tranquilo.", icon: <FaBed /> },
    { text: "Estabeleça um horário fixo para dormir e acordar.", icon: <FaClock /> },
    { text: "Pratique atividades relaxantes antes de dormir.", icon: <FaSmog /> }
  ]);

  const handleSubmit = () => {
    alert(`Dormiu às: ${sleepTime}, Acordou às: ${wakeTime}, Humor: ${mood}`);
    setModalOpen(false);
    setSleepTime("");
    setWakeTime("");
    setMood("");
  };

  const [selectedGuideline, setSelectedGuideline] = useState(null);

  const handleSchedule = () => {
    alert(`Data marcada: ${selectedDate} as ${selectedTime}, será enviado um e-mail confirmando esta solicitação.`);
    setAgendamentoModalOpen(false);
  };

  const handleGuidelineClick = (index) => {
    console.log('passei aqui');
    setSelectedGuideline(index);
  };

  const [guidelineDescriptions] = useState([
    "A cafeína pode interferir no seu sono, então é melhor evitá-la algumas horas antes de dormir.",
    "Um ambiente escuro e tranquilo ajuda a promover um sono mais profundo e reparador.",
    "Ter um horário fixo para dormir e acordar ajuda a regular o seu relógio biológico.",
    "Atividades relaxantes, como ler ou meditar, podem preparar sua mente para dormir."
  ]);

  const handleQuestionSubmit = () => {
    alert(`Sua pergunta foi enviada: ${patientQuestion}`);
    setQuestionModalOpen(false);
    setPatientQuestion("");
  };

  return (
    <Wrapper>
      <Title className="font30 extraBold">Dashboard de Sono</Title>
      <ProfileContainer>
        <ProfileCard>
          <h3 className="font20">Perfil do Paciente</h3>
          <ProfileDetails>
            <Detail>
              <span>Nome:</span> {displayName}
            </Detail>
            <Detail>
              <span>Email:</span> {email}
            </Detail>
            <Detail>
              <span>Idade:</span> {age} anos
            </Detail>
            <Detail>
              <span>Peso:</span> 75 kg
            </Detail>
            <Detail>
              <span>IMC:</span> 23.4
            </Detail>
          </ProfileDetails>
        </ProfileCard>
        <HistoryCard>
          <h3 className="font20">Histórico de Atendimentos</h3>
          <HistoryItem>
            Consulta - 10/09/2024
            <Recommendation>Recomendação: Continue mantendo uma rotina de sono regular.</Recommendation>
          </HistoryItem>
          <HistoryItem>
            Consulta - 01/08/2024
            <Recommendation>Recomendação: Tente relaxar antes de dormir.</Recommendation>
          </HistoryItem>
          <HistoryItem>
            Consulta - 15/07/2024
            <Recommendation>Recomendação: Evite telas antes de dormir.</Recommendation>
          </HistoryItem>
        </HistoryCard>
        <DistributionCard>
          <h3 className="font20">Distribuição do humor ao acordar</h3>
          <ContentWrapper>
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <Legend>
              {pieData.map((entry, index) => (
                <LegendItem key={`legend-${index}`}>
                  <ColorBox style={{ backgroundColor: entry.fill }} />
                  <span>{entry.name}: {entry.value}</span>
                </LegendItem>
              ))}
            </Legend>
          </ContentWrapper>
        </DistributionCard>
      </ProfileContainer>
      <CenteredButton onClick={() => setModalOpen(true)}>Registrar Horário de Sono</CenteredButton>
      <Spacer />
      {modalOpen && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Registrar Horário de Sono</ModalTitle>
            <ModalInput
              type="time"
              placeholder="Hora de dormir"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
            <ModalInput
              type="time"
              placeholder="Hora de acordar"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
            <MoodSelect
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="">Selecione seu humor</option>
              <option value="Feliz">Feliz</option>
              <option value="Neutro">Neutro</option>
              <option value="Triste">Triste</option>
            </MoodSelect>
            <Button onClick={handleSubmit}>Salvar</Button>
            <Button onClick={() => setModalOpen(false)} style={{ marginLeft: '10px' }}>Cancelar</Button>
          </Modal>
        </ModalOverlay>
      )}
      <GraphTitle>Horas de Sono nos Últimos 30 Dias</GraphTitle>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" hide={window.innerWidth < 600} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="hours" stroke="#005f73" strokeWidth={2} />
          <LineTooltip />
        </LineChart>
      </ResponsiveContainer>
      <LegendGraph>
        <LegendItemGraph>
          <ColorBox style={{ backgroundColor: '#8884d8' }} />
          <span>Horas de Sono</span>
        </LegendItemGraph>
      </LegendGraph>

      {/* Seção de Contato com o Médico */}
      <ContactSection>
        <CalendarContainer>
          <h3 className="font20">Marcar Consultas e Exames</h3>
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            tileContent={({ date }) => {
              const isConsultation = date.getDate() === 10; 
              const isExam = date.getDate() === 15; 
              return (
                <div>
                  {isConsultation && <Dot />}
                  {isExam && <Dot style={{ backgroundColor: 'red' }} />}
                </div>
              );
            }} 
          />
          <ScheduleButton onClick={() => setAgendamentoModalOpen(true)}>Solicitar agendamento</ScheduleButton>
          {agendamentoModalOpen && (
    <ModalOverlay>
        <Modal>
            <ModalTitle>Agendar Consulta</ModalTitle>
            <div style={{ margin: '10px 0' }}>
                <select style={StyledSelect} onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
                    <option value="">Selecione um dia</option>
                    <option value="10/10/2024">10/10/2024</option>
                    <option value="12/10/2024">12/10/2024</option>
                    <option value="14/10/2024">14/10/2024</option>
                    <option value="16/10/2024">16/10/2024</option>
                </select>
            </div>
            <div style={{ margin: '10px 0' }}>
                <select style={StyledSelect} onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime}>
                    <option value="">Selecione um horário</option>
                    <option value="08:00">08:00</option>
                    <option value="10:00">10:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                </select>
            </div>
            <Button onClick={handleSchedule}>Agendar Consulta</Button>
            <Button onClick={() => setModalOpen(false)} style={{ marginLeft: '10px' }}>Cancelar</Button>
        </Modal>
    </ModalOverlay>
    )}
        </CalendarContainer>
        <GuidelinesCard>
          <h3 className="font20">Iniciando o programa</h3>
          <GuidelinesList>
            {generalGuidelines.map((guideline, index) => (
              <GuidelineCard key={index} onClick={() => handleGuidelineClick(index)}>
                <IconWrapper>{guideline.icon}</IconWrapper>
                    <p>{guideline.text}</p>
            </GuidelineCard>
            ))}
          </GuidelinesList>
        </GuidelinesCard>
      {selectedGuideline !== null && (
            <ModalOverlay>
                <Modal>
                    <ModalTitle>{generalGuidelines[selectedGuideline].text}</ModalTitle>
                    <p>{guidelineDescriptions[selectedGuideline]}</p>
                <Button onClick={() => setSelectedGuideline(null)}>Fechar</Button>
                </Modal>
            </ModalOverlay>
        )}
        
        <ChatContainer>
          <h3 className="font20">Conversa com o Médico</h3>
          <LastInteraction>
            <p><strong>Última Pergunta:</strong> {lastQuestion}</p>
            <p><strong>Resposta do Médico:</strong> {lastAnswer}</p>
          </LastInteraction>
          <CenteredButton onClick={() => setQuestionModalOpen(true)}>Fazer uma Pergunta</CenteredButton>
          {questionModalOpen && (
            <ModalOverlay>
              <Modal>
                <ModalTitle>Fazer uma Pergunta ao Médico</ModalTitle>
                <ModalInput
                  type="text"
                  placeholder="Digite sua pergunta"
                  value={patientQuestion}
                  onChange={(e) => setPatientQuestion(e.target.value)}
                />
                <Button onClick={handleQuestionSubmit}>Enviar</Button>
                <Button onClick={() => setQuestionModalOpen(false)} style={{ marginLeft: '10px' }}>Cancelar</Button>
              </Modal>
            </ModalOverlay>
          )}
        </ChatContainer>
      </ContactSection>
    </Wrapper>
  );
}



