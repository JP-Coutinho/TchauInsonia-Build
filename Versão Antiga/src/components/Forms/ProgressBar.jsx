import React from "react";
import styled from "styled-components";

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <ProgressContainer>
      <ProgressText>
        Pergunta {current} de {total}
      </ProgressText>
      <ProgressBarContainer>
        <ProgressBarFill style={{ width: `${percentage}%` }} />
      </ProgressBarContainer>
      <PercentageText>{Math.round(percentage)}% concluído</PercentageText>
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const ProgressText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const PercentageText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

export default ProgressBar;