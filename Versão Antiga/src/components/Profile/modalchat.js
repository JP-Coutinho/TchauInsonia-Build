import React, { useState } from 'react';
import { ModalOverlay, ModalContent, ModalCloseButton, ModalTitle,  ChatBox, ChatBubble, InputField, Button } from './styles';

const ModalChat = ({ isOpen, onClose, chatMock }) => {
  const [messages, setMessages] = useState(
    chatMock.map((item, index) => ({ sender: 'bot', text: item.question, answer: item.answer }))
  );
  const [userInput, setUserInput] = useState('');

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleUserSubmit = () => {
    if (userInput.trim()) {
      setMessages([
        ...messages,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: 'Aqui está sua resposta!' }
      ]);
      setUserInput('');
    }
  };

  return (
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
          <ModalTitle>Chat de Perguntas e Respostas - Sono</ModalTitle>
          <ChatBox>
            {messages.map((msg, index) => (
              <ChatBubble key={index} sender={msg.sender}>
                <p>{msg.text}</p>
                {msg.sender === 'bot' && <p><strong>Resposta:</strong> {msg.answer}</p>}
              </ChatBubble>
            ))}
          </ChatBox>
          <InputField
            type="text"
            value={userInput}
            onChange={handleUserInputChange}
            placeholder="Digite sua pergunta ou resposta..."
          />
          <Button onClick={handleUserSubmit}>Enviar</Button>
        </ModalContent>
      </ModalOverlay>
    )
};

export default ModalChat;
