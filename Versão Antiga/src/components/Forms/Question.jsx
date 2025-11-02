import React from "react";
import styled from "styled-components";

export default function Question({ question, onAnswer }) {
  return (
    <QuestionContainer>
      <QuestionText>{question}</QuestionText>
      <ButtonContainer>
        <YesButton onClick={() => onAnswer("Sim")}>Sim</YesButton>
        <NoButton onClick={() => onAnswer("Não")}>Não</NoButton>
      </ButtonContainer>
    </QuestionContainer>
  );
}

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
`;

const BaseButton = styled.button`
  padding: 15px 40px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const YesButton = styled(BaseButton)`
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }
`;

const NoButton = styled(BaseButton)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;