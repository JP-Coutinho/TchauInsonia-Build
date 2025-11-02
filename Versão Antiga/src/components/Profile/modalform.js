import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalTitle,
  Button,
  ModalText,
  VideoFrame,
} from './styles';

const ModalForm = ({ title, description, video, pdf, onClose, questions, formDate }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true); // Confirma se está em ambiente de browser
  }, []);

  if (!isBrowser) return null; // Retorna null se não estiver em ambiente browser

  // Função para formatar a data
  const formatDate = (date) => {
    if (!date) return ''; // Caso não haja data, retorna uma string vazia
    const formattedDate = new Date(date).toLocaleDateString('pt-BR'); // Formata a data para o formato "dd/mm/yyyy"
    return formattedDate;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ overflowY: 'auto' }}>
        <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
          <ModalTitle>{title}</ModalTitle>
          <div style={{marginBottom: '20px'}}>

            {formDate && (
                <span style={{ fontSize: '14px', color: '#555',  }}>
                    <strong>Formulario respondido em: </strong>{formatDate(formDate)}
                </span>
            )}
          </div>

        {questions && (
          <div>
            <h4>Respostas:</h4>
            {questions.map((q, index) => (
              <div key={index}>
                <strong>{q.question}</strong>
                <p>{q.answer}</p>
              </div>
            ))}
          </div>
        )}

        {video && <VideoFrame src={video} frameBorder="0" allowFullScreen></VideoFrame>}

        <div style={{ marginTop: '20px' }}>
          <ModalText dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        {pdf && (
          <div>
            <a href={pdf} target="_blank" rel="noopener noreferrer">
              <Button>Baixar PDF</Button>
            </a>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalForm;
