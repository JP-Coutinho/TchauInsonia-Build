import styled from "styled-components";

// Estilizações
export const Wrapper = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
`;

export const Dropdown = ({ children }) => (
    <div style={{
        margin: '10px 0',
        border: '1px solid #c0c0c0', // Borda clara
        borderRadius: '8px', // Bordas arredondadas
        padding: '10px', // Espaçamento interno
        width: '95%', // Para ocupar toda a largura
        boxSizing: 'border-box', // Para incluir padding e borda na largura total
        fontSize: '16px', // Tamanho da fonte
    }}>
        {children}
    </div>
);

export const StyledSelect = {
    border: '1px solid #c0c0c0', // Borda clara
    borderRadius: '8px', // Bordas arredondadas
    padding: '10px', // Espaçamento interno
    width: '95%', // Para ocupar toda a largura
    fontSize: '16px', // Tamanho da fonte
    cursor: 'pointer', // Mudar o cursor para pointer
};

export const GuidelineCard = styled.div`
  display: flex;
  flex-wrap: wrap; // Permite que os itens se movam para a próxima linha
  align-items: center;
  margin: 10px 0;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  }
`;

export const IconWrapper = styled.div`
  margin-right: 10px;
  font-size: 24px; // Tamanho do ícone
  color: #4f4f4f; // Cor do ícone
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-wrap: wrap; // Permite que os itens se movam para a próxima linha
  justify-content: space-between;

  @media (max-width: 1280px) {
    flex-direction: column; // Altera a direção para coluna em telas pequenas
  }
`;

export const ProfileCard = styled.div`
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;

    @media (max-width: 1280px) {
    margin-bottom: 20px;
    width: 100%; // Faz com que o card ocupe toda a largura em telas pequenas
  }
`;

export const GuidelinesCard = styled.div`
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-left: 20px;

      @media (max-width: 1280px) {
    margin-left: 0px !important;
    margin-bottom: 20px;
    width: 100%; // Faz com que o card ocupe toda a largura em telas pequenas
  }
  
`;

export const ChatContainer = styled.div`
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-left: 20px;

      @media (max-width: 1280px) {
    margin-left: 0px !important;
    width: 100%; // Faz com que o card ocupe toda a largura em telas pequenas
  }
`;

export const HistoryCard = styled.div`
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-left: 20px;

    @media (max-width: 1280px) {
    margin-bottom: 20px;
    margin-left: 0px !important;
    width: 100%; // Faz com que o card ocupe toda a largura em telas pequenas
  }
`;

export const DistributionCard = styled.div`
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-left: 20px;

    @media (max-width: 1280px) {
    margin-left: 0px !important;
    width: 100%; // Faz com que o card ocupe toda a largura em telas pequenas
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

export const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

export const CenteredButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #005f73; /* Azul escuro pastel */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
`;

export const Spacer = styled.div`
  height: 20px; /* Espaço entre o botão e o gráfico */
`;

export const GraphTitle = styled.h2`
  text-align: center;
  margin: 20px 0;
`;

export const LegendGraph = styled.div`
  display: flex;
  justify-content: flex-end; /* Alinha a legenda à direita */
  margin-top: 10px;
`;

export const LegendItemGraph = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; 
`;

export const Modal = styled.div`
  background: white;
  padding: 20px;
  z-index: 1000;
  border-radius: 8px;
  width: 400px;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 15px 0;
`;

export const ModalInput = styled.input`
  display: block;
  width: 95%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const MoodSelect = styled.select`
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #005f73;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
`;

export const CalendarContainer = styled.div`
  flex: 1;
  flex-wrap: wrap;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column; // Organiza os elementos verticalmente
  justify-content: space-between; // Distribui o conteúdo uniformemente
  align-items: center; // Centraliza o conteúdo horizontalmente
    @media (max-width: 1280px) {
        margin-bottom: 20px;
        margin-left: 0px !important;
        width: 100%; // Faz com que o card ocupe toda a largura em telas pequenas
    }
`;

export const ScheduleButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #005f73;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  align-self: center; // Centraliza o botão horizontalmente
`;


export const LastInteraction = styled.div`
  margin-bottom: 20px;
`;

export const ContactSection = styled.div`
  display: flex;
  flex-wrap: wrap; // Permite que os itens se movam para a próxima linha
  justify-content: space-between;

  @media (max-width: 1280px) {
    flex-direction: column; // Altera a direção para coluna em telas pequenas
  }
`;

export const Dot = styled.div`
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
  position: absolute;
  margin-left: 10px;
`;

export const ProfileDetails = styled.div`
  margin-bottom: 10px;
`;

export const Detail = styled.div`
  margin: 5px 0;
`;

export const HistoryItem = styled.div`
  margin: 10px 0;
`;

export const Recommendation = styled.div`
  font-style: italic;
  margin-top: 5px;
`;



export const GuidelinesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const GuidelineItem = styled.li`
  margin: 5px 0;
  display: flex;
  align-items: center;
  
`;