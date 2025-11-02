import styled from 'styled-components';

export const Container = styled.div`
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  color: #212529;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const Header = styled.div`
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    text-align: center;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #0d6efd, #0056b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const MenuContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
    justify-content: center;
    margin-top: 20px; /* Adiciona espaço superior no mobile */
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 20px;
    margin-top: 50px; /* Mais espaço em telas menores */
  }
`;

export const MenuItem = styled.button`
  background: ${props => props.active ? '#0d6efd' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  border: ${props => props.active ? 'none' : '1px solid #dee2e6'};
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
    color: ${props => props.active ? 'white' : '#495057'};
    border-color: ${props => props.active ? 'none' : '#adb5bd'};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

export const ContentArea = styled.div`
  margin-bottom: 40px; /* Reduzido de 100px para 40px */

  @media (max-width: 480px) {
    margin-bottom: 30px; /* Reduzido de 120px para 30px */
  }
`;

export const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  justify-items: center;
  max-width: 1200px;
  margin: 20px auto 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin: 15px auto 0 auto;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    margin: 10px auto 0 auto;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

export const PlaylistCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:hover button {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 200px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    max-width: 180px;
  }

  @media (max-width: 360px) {
    padding: 10px;
    max-width: 160px;
  }
`;

export const PlaylistImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;

  @media (max-width: 768px) {
    height: 140px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    height: 120px;
    margin-bottom: 10px;
  }

  @media (max-width: 360px) {
    height: 100px;
    margin-bottom: 8px;
  }
`;

export const PlayButton = styled.button`
  position: absolute;
  bottom: 110px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #28a745;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #218838;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    bottom: 95px;
    right: 15px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    bottom: 85px;
    right: 12px;
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  @media (max-width: 360px) {
    bottom: 75px;
    right: 10px;
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`;

export const PlaylistTitle = styled.h3`
  color: #212529;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }
`;

export const PlaylistDescription = styled.p`
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    -webkit-line-clamp: 1;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #dee2e6;
  padding: 20px;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    flex-direction: column;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;

  strong {
    color: #212529;
    font-size: 0.875rem;
  }

  span {
    color: #6c757d;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    text-align: center;
    margin-bottom: 10px;

    strong {
      font-size: 0.8rem;
    }

    span {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    strong {
      font-size: 0.75rem;
    }

    span {
      font-size: 0.65rem;
    }
  }
`;

export const SectionContainer = styled.div`
  margin: 20px 0; /* Reduzido de 40px para 20px */
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 15px 0; /* Reduzido de 30px para 15px */
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    margin: 10px 0; /* Reduzido de 20px para 10px */
    padding: 0 10px;
  }
`;

export const SectionTitle = styled.h3`
  color: #212529;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 10px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 10px;
    padding-left: 5px;
  }
`;

export const HorizontalScroll = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px;
  scroll-behavior: smooth;

  /* Estilização da barra de rolagem */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #0d6efd;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #0056b3;
  }

  /* Para os cards dentro do scroll horizontal */
  ${PlaylistCard} {
    min-width: 200px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      min-width: 180px;
    }

    @media (max-width: 480px) {
      min-width: 160px;
    }

    @media (max-width: 360px) {
      min-width: 140px;
    }
  }

  @media (max-width: 768px) {
    gap: 15px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 5px;
  }
`;