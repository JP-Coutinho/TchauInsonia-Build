import React from 'react';
import styled from 'styled-components';

const NotificationIconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  svg {
    fill: red; /* Cor do ícone */
    width: 24px;
    height: 24px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: white; /* Cor do fundo do badge */
  color: red; /* Cor do texto do badge */
  border-radius: 50%;
  padding: 2px 5px;
  font-size: 12px; /* Tamanho da fonte */
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Sombra para destacar o badge */
`;

const NotificationIcon = (props) => (
  <NotificationIconWrapper {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 22c1.104 0 2-.896 2-2H10c0 1.104.896 2 2 2zm6-4V10c0-4.418-3.582-8-8-8S2 5.582 2 10v8l-2 2h20l-2-2z" />
    </svg>
    <NotificationBadge>1</NotificationBadge> {/* Número de notificações */}
  </NotificationIconWrapper>
);

export default NotificationIcon;