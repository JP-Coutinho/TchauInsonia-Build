import React, { useState } from 'react';
import { patientData } from './data';  // Importando os dados mockados
import Modal from './modal';  // Importando a modal que você já possui
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    Container,
    ProfileSection,
    Title,
    Card,
    CardTitle,
    CardContent,
    ProfileHeader,
    ProfileImage,
    ProfileInfo,
    ProfileDetail,
    ConsultationCard,
    ConsultationList,
    Wrapper,
  } from './styles';

const Detail = ({user}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const handleConsultationClick = (consultation) => {
        console.log('Consulta', consultation)
      setSelectedConsultation(consultation);
    };
  
    const closeModal = () => {
      setSelectedConsultation(null);
    };
  
    return (
      <Wrapper>
        <Container>
        <ProfileSection>
          {/* Header com foto e dados do paciente */}
          <ProfileHeader>
            <ProfileImage src={patientData.profileImage || 'https://img.icons8.com/ios/452/user.png'} alt="Foto do paciente" />
            <ProfileInfo>
              <h2>{user.displayName}</h2>
              <ProfileDetail><strong>Idade:</strong> {patientData.age}</ProfileDetail>
              <ProfileDetail><strong>Peso:</strong> {patientData.weight} kg</ProfileDetail>
              <ProfileDetail><strong>Altura:</strong> {patientData.height} cm</ProfileDetail>
            </ProfileInfo>
          </ProfileHeader>
          
          <Title>Perfil do Paciente</Title>
  
          {/* Resumo do paciente */}
          <Card>
            <CardTitle>Resumo do Paciente</CardTitle>
            <CardContent>{patientData.anamnesis.join(' ')}</CardContent>
          </Card>
  
          {/* Sugestões médicas */}
          <Card>
            <CardTitle>Sugestões Médicas</CardTitle>
            <CardContent>{patientData.medicalSuggestions}</CardContent>
          </Card>
  
          {/* Informações de Contato */}
          <Card>
            <CardTitle>Informações de Contato</CardTitle>
            <CardContent>
              <p>Email: {patientData.contact.email}</p>
              <p>Telefone: {patientData.contact.phone}</p>
            </CardContent>
          </Card>
  
          {/* Consultas Realizadas */}
          <Card>
            <CardTitle>Consultas Realizadas</CardTitle>
            <ConsultationList>
              {patientData.appointments.map((appointment) => (
                <ConsultationCard key={appointment.id} onClick={() => handleConsultationClick(appointment)}>
                  <strong>{appointment.title}</strong>
                  <p>{appointment.date} - {appointment.time}</p>
                </ConsultationCard>
              ))}
            </ConsultationList>
          </Card>
          
          {/* Calendário */}
          <div>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
  
          {/* Modal para consulta detalhada */}
          {selectedConsultation && (
            <Modal onClose={closeModal} title={`Detalhes da Consulta: ${selectedConsultation.title}`} description={selectedConsultation.details} />
          )}
        </ProfileSection>
      </Container>
      </Wrapper>
    );
  };

  export default Detail;
