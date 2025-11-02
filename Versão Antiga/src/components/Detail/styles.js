import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const ProfileSection = styled.section`
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
`;

export const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
`;

export const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const CardContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

export const ProfileInfo = styled.div`
  font-size: 18px;
`;

export const ProfileDetail = styled.div`
  margin: 5px 0;
`;

export const ConsultationList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ConsultationCard = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f7f7f7;
  }

  strong {
    font-size: 18px;
  }

  p {
    font-size: 16px;
    color: #666;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  max-width: 600px;
  margin: 20px;
  border-radius: 10px;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const ModalText = styled.p`
  font-size: 16px;
  line-height: 1.6;
`;

export const ModalFooter = styled.div`
  margin-top: 20px;
  text-align: right;
`;


export const Wrapper = styled.div`
  padding: 120px;`;

  export const VideoFrame = styled.iframe`
  width: 100%;
  height: 315px;
  border: none;
  border-radius: 8px;
  margin-top: 15px;
`;

