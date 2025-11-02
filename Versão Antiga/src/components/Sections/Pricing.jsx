import React from "react";
import styled from "styled-components";
// Components
import PricingTable from "../Elements/PricingTable";

export default function Pricing() {
  return (
    <Wrapper id="pricing">
      <div className="whiteBg">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Escolha o Plano Ideal para Melhorar Seu Sono</h1>
            <p className="font13">
              Nossos planos foram desenvolvidos para fornecer soluções personalizadas para melhorar a qualidade do seu sono.
              <br />
              Escolha o pacote que melhor atenda às suas necessidades.
            </p>
          </HeaderInfo>
          <TablesWrapper className="flexSpaceNull">
            {/* Plano Starter */}
            <TableBox>
              <PricingTable
                icon="sleep"
                price="R$29,99/mês"
                title="Plano Básico"
                text="Ideal para quem deseja monitorar o sono de forma simples e eficaz."
                offers={[
                  { name: "Monitoramento avançado de sono", cheked: true },
                  { name: "Relatórios semanais", cheked: true },
                  { name: "Insights personalizados", cheked: false },
                  { name: "Acesso ao histórico completo e detalhado", cheked: false },
                  { name: "Dicas personalizadas", cheked: false },
                  { name: "Consultas mensais com especialistas", cheked: false },
                ]}
                action={() => alert("Plano Básico selecionado")}
              />
            </TableBox>

            {/* Plano Intermediário */}
            <TableBox>
              <PricingTable
                icon="monitor"
                price="R$49,99/mês"
                title="Plano Intermediário"
                text="Para quem deseja uma análise mais completa e acesso a mais funcionalidades."
                offers={[
                  { name: "Monitoramento avançado de sono", cheked: true },
                  { name: "Relatórios diários", cheked: true },
                  { name: "Insights personalizados", cheked: true },
                  { name: "Acesso ao histórico completo e detalhado", cheked: true },
                  { name: "Dicas personalizadas", cheked: false },
                  { name: "Consultas mensais com especialistas", cheked: false },
                ]}
                action={() => alert("Plano Intermediário selecionado")}
              />
            </TableBox>

            {/* Plano Premium */}
            <TableBox>
              <PricingTable
                icon="premium"
                price="R$79,99/mês"
                title="Plano Premium"
                text="A melhor opção para quem busca total acompanhamento e assistência."
                offers={[
                  { name: "Monitoramento avançado e personalizado", cheked: true },
                  { name: "Relatórios diários", cheked: true },
                  { name: "Insights personalizados", cheked: true },
                  { name: "Acesso a histórico completo e detalhado", cheked: true },
                  { name: "Dicas personalizadas", cheked: true },
                  { name: "Consultas mensais com especialistas", cheked: true },
                ]}
                action={() => alert("Plano Premium selecionado")}
              />
            </TableBox>
          </TablesWrapper>
        </div>
      </div>
    </Wrapper>
  );
}

// Estilos do componente Pricing
const Wrapper = styled.section`
  width: 100%;
  padding: 50px 0;
`;

const HeaderInfo = styled.div`
  margin-bottom: 50px;
  text-align: center;
`;

const TablesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 860px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TableBox = styled.div`
  width: 31%;
  @media (max-width: 860px) {
    width: 100%;
    max-width: 370px;
    margin: 20px 0;
  }
`;