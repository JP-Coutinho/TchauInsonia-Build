import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9f9f9;
`;

export const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const ProfileTitle = styled.h1`
  font-size: 2rem;
  color: #333;
`;

export const StatusIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.status === 1 ? '#4caf50' : props.status === 2 ? '#ffc107' : '#f44336'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

export const ProfileSubtitle = styled.p`
  font-size: 1rem;
  color: #666;
`;

export const Section = styled.div`
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #222;
  margin-bottom: 15px;
`;

export const SectionText = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
`;

export const ListItem = styled.li`
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 70px; // Espaço para o menu superior
`;

export const InstructionCard = styled.div`
  flex: 1 1 calc(33.33% - 20px);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 20px);
  }

  @media (max-width: 480px) {
    flex: 1 1 100%;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 10px;
`;

export const CardText = styled.p`
  font-size: 1rem;
  color: #666;
`;

export const Resource = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ResourceTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 10px;
`;

export const ResourceText = styled.p`
  font-size: 1rem;
  color: #666;
`;

export const Button = styled.button`
  display: inline-block;
  padding: 10px 20px;
  margin-top: 15px;
  font-size: 1rem;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export const OrientationCard = styled.div`
  flex: 1 1 calc(33.33% - 20px);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 20px);
  }

  @media (max-width: 480px) {
    flex: 1 1 100%;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 700px;
  padding: 20px;
  position: relative;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #222;
`;

export const ModalText = styled.p`
  font-size: 1rem;
  margin-bottom: 15px;
  color: #333;
`;

export const VideoFrame = styled.iframe`
  width: 100%;
  height: 315px;
  border: none;
  border-radius: 8px;
  margin-top: 15px;
`;

export const ModalTitleChat = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #222;
`;

export const ModalTextChat = styled.p`
  font-size: 1rem;
  margin-bottom: 15px;
  color: #333;
`;

export const InputField = styled.input`
  width: calc(100% - 40px);
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  display: block;
`;

export const ChatBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
`;

export const ChatBubble = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => (props.sender === 'bot' ? '#f1f1f1' : '#e0f7fa')};
  border-radius: 8px;
  word-wrap: break-word;
  
  p {
    margin: 0;
  }
`;

export const ButtonChat = styled.button`
  display: inline-block;
  padding: 10px 20px;
  margin-top: 15px;
  font-size: 1rem;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;
