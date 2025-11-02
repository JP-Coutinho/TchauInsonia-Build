import React, { useState } from "react";
import {
  Container,
  ProfileHeader,
  ProfileTitle,
  ProfileSubtitle,
  Section,
  SectionTitle,
  SectionText,
  OrientationCard,
  CardContainer,
  InstructionCard,
  CardTitle,
  CardText,
  Resource,
  ResourceTitle,
  ResourceText,
  Button,
} from './styles';
import { orientations } from "./data";
import { instructions } from "./data";
import { formResponsesMock } from "./data";
import { chatMock } from "./data";
import Modal from './modal'; 
import ModalForm from "./modalform";
import ModalChat from "./modalchat";
import { StatusIcon } from './styles';



export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenForm, setIsModalOpenForm] = useState(false);
  const [isModalOpenChat, setIsModalOpenChat] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [viewedCards, setViewedCards] = useState(new Set([0])); // Inicia com o primeiro card visível
  const [unlockedSections, setUnlockedSections] = useState(new Set(['orientations'])); // Controla seções desbloqueadas

  const openModal = (content, index, sectionType = 'orientations') => {
    setCurrentContent(content);
    setIsModalOpen(true);
    
    // Marca o card atual e o próximo como visualizados
    setViewedCards(prev => new Set([...prev, index, index + 1]));
    
    // Verifica se todos os cards da seção atual foram visualizados
    checkSectionCompletion(sectionType, index);
  };

  const checkSectionCompletion = (sectionType, currentIndex) => {
    let sectionData;
    let nextSection;
    
    switch(sectionType) {
      case 'orientations':
        sectionData = orientations;
        nextSection = 'instructions';
        break;
      case 'instructions':
        sectionData = instructions;
        nextSection = 'forms';
        break;
      default:
        return;
    }
    
    // Se o card atual é o último da seção, desbloqueia a próxima seção
    if (currentIndex === sectionData.length - 1) {
      setUnlockedSections(prev => new Set([...prev, nextSection]));
    }
  };

  const openModalForm = (content) => {
    setCurrentContent(content);
    setIsModalOpenForm(true);
  };

  const openModalChat = (content) => {
    setCurrentContent(content);
    setIsModalOpenChat(true);
  };

  const closeModalChat = (content) => {
    setCurrentContent(content);
    setIsModalOpenChat(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContent(null);
  };

  const closeModalForm = () => {
    setIsModalOpenForm(false);
    setCurrentContent(null);
  };

  return (
    <Container>
      {/* Header */}
      <ProfileHeader>
        <ProfileTitle>Perfil do Paciente</ProfileTitle>
        <ProfileSubtitle></ProfileSubtitle>
      </ProfileHeader>

      {/* Patologias */}
      <Section>
        <SectionTitle>Patologia</SectionTitle>
        <SectionText>
          <strong>Insônia Crônica:</strong> Dificuldade persistente para iniciar ou manter o sono, resultando em impacto
          significativo na qualidade de vida.
        </SectionText>
      </Section>

      {/* Orientações Gerais */}
      <Section>
        <SectionTitle>Iniciando o programa</SectionTitle>
        <CardContainer>
          {orientations.map((orientation, index) => (
            viewedCards.has(index) && (
              <OrientationCard key={index} onClick={() => openModal(orientation, index, 'orientations')}>
                <StatusIcon status={orientation.finished}>
                  {orientation.finished === 1 ? '✔' : orientation.finished === 2 ? '⚠' : '✖'}
                </StatusIcon>
                <CardTitle>{orientation.title}</CardTitle>
                <CardText>{orientation.shortDescription}</CardText>
              </OrientationCard>
            )
          ))}
        </CardContainer>
      </Section>

      {/* Modal Component */}
      {isModalOpen && currentContent && (
        <Modal
          title={currentContent.title}
          description={currentContent.description}
          video={currentContent.video}
          audio={currentContent.audio}
          pdf={currentContent.pdf}
          onClose={closeModal}
        />
      )}

    {isModalOpenForm && currentContent && (
        <ModalForm
          title={currentContent.title}
          description={currentContent.medicalObservation}
          video={currentContent.video}
          pdf={currentContent.pdf}
          onClose={closeModalForm}
          formDate={new Date()}
          questions={currentContent.questions}
        />
      )}

    {isModalOpenChat && currentContent && (
        <ModalChat
          chatMock={currentContent}
          onClose={closeModalChat}
        />
      )}

      {/* Primeira etapa - só aparece se a seção anterior foi concluída */}
      {unlockedSections.has('instructions') && (
        <Section>
          <SectionTitle>Primeira etapa</SectionTitle>
          <CardContainer>
            {instructions.map((instruction, index) => (
              viewedCards.has(index) && (
                <OrientationCard key={index} onClick={() => openModal(instruction, index, 'instructions')}>
                  <StatusIcon status={instruction.finished}>
                    {instruction.finished === 1 ? '✔' : instruction.finished === 2 ? '⚠' : '✖'}
                  </StatusIcon>
                  <CardTitle>{instruction.title}</CardTitle>
                  <CardText>{instruction.shortDescription}</CardText>
                </OrientationCard>
              )
            ))}
          </CardContainer>
        </Section>
      )}

      {/* Formulários - só aparece se a seção anterior foi concluída */}
      {unlockedSections.has('forms') && (
        <>
          <Section>
            <SectionTitle>Diagnóstico da sua insonia</SectionTitle>
            <CardContainer>
              {formResponsesMock.map((response, index) => (
                <OrientationCard key={index} onClick={() => openModalForm(response)}>
                  <CardTitle>{response.title}</CardTitle>
                  <CardText>{response.shortDescription}</CardText>
                </OrientationCard>
              ))}
            </CardContainer>
          </Section>

          {/* Formulários Respondidos */}
          <Section>
            <SectionTitle>Formulários Respondidos</SectionTitle>
            <CardContainer>
              {formResponsesMock.map((response, index) => (
              <OrientationCard key={index} onClick={() => openModalForm(response)}>
                <CardTitle>{response.title}</CardTitle>
                <CardText>{response.shortDescription}</CardText>
              </OrientationCard>
            ))}
            </CardContainer>
          </Section>
        </>
      )}

      {/* Recursos */}
      <Section>
        <SectionTitle>Recursos</SectionTitle>
        <Resource>
          <ResourceTitle>Vídeos</ResourceTitle>
          <ResourceText>Assista a vídeos educativos sobre higiene do sono e técnicas de relaxamento.</ResourceText>
          <Button>Ver Vídeos</Button>
        </Resource>

        <Resource>
          <ResourceTitle>Mentorias</ResourceTitle>
          <ResourceText>Agende sessões de mentoria com especialistas em sono.</ResourceText>
          <Button>Agendar Mentoria</Button>
        </Resource>

        <Resource>
          <ResourceTitle>Bate-papo com o Médico</ResourceTitle>
          <ResourceText>Converse diretamente com seu médico sobre dúvidas e acompanhamento.</ResourceText>
          <Button onClick={() => openModalChat(chatMock)}>Iniciar Bate-papo</Button>
        </Resource>
      </Section>
    </Container>
  );
};