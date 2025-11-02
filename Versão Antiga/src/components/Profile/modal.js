import React, { useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalTitle,
  ModalText,
  VideoFrame,
} from './styles';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Modal = ({ title, description, video, pdf, onClose, audio }) => {

  const [numeroPaginas, setNumeroPaginas] = useState(0);

  return (
    <ModalOverlay onClick={onClose} role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ overflowY: 'auto' }}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <ModalTitle id="modal-title">{title}</ModalTitle>
        <div role="document" id="modal-description">
          {video && (
            <VideoFrame
              src={video}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              aria-label="Vídeo em destaque"
            />
          )}
          {audio && (
            <audio controls style={{ width: '100%', marginTop: 8 }}>
              <source src={audio} type="audio/wav" />
                Seu navegador não suporta o elemento de áudio.
            </audio>
          )}
          <ModalText dangerouslySetInnerHTML={{ __html: description }} />

          {pdf && (
            <div style={{ marginTop: '15px' }}>
              <Document
                file={pdf}
                onLoadSuccess={({ numPages }) => setNumeroPaginas(numPages)}
                onLoadError={(error) => console.error("Erro ao carregar o PDF:", error)}
              >
                {Array.from({ length: numeroPaginas }, (_, index) => (
                  <Page key={index} pageNumber={index + 1} aria-label={`Página ${index + 1} do PDF`} />
                ))}
              </Document>
            </div>
          )}
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
