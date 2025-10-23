// Caminho: app/proposta/[id]/templates/moderno/TemplateModerno.tsx

import './moderno.css'; // Importa o CSS específico deste template

// Tipagem dos dados que o template espera receber
type PropostaCompleta = {
  // ... (a mesma tipagem que já tínhamos na page.tsx)
  id: number;
  data_proposta: string;
  valor_recorrente: number;
  valor_eventual: number;
  condicoes_pagamento: string;
  informacoes_complementares: string;
  validade_dias: number;
  escritorios: { razao_social: string; logo_url: string; } | null;
  clientes: { nome_fantasia_ou_nome: string; } | null;
  nome_cliente_avulso: string;
  proposta_itens: { nome_servico: string; valor_servico: number; categoria_servico: 'Recorrente' | 'Eventual'; }[];
};

// O componente recebe os dados da proposta como uma prop
export default function TemplateModerno({ proposta }: { proposta: PropostaCompleta }) {
  
  // Toda a lógica de formatação de data e filtro de serviços vem para cá
  const dataProposta = new Date(proposta.data_proposta);
  const dataValidade = new Date(dataProposta.getTime());
  dataValidade.setDate(dataValidade.getDate() + proposta.validade_dias);
  const dataValidadeFormatada = dataValidade.toLocaleDateString('pt-BR');

  const servicosRecorrentes = proposta.proposta_itens.filter(item => item.categoria_servico === 'Recorrente');
  const servicosEventuais = proposta.proposta_itens.filter(item => item.categoria_servico === 'Eventual');

  // O JSX é exatamente o mesmo que já tínhamos, sem nenhuma alteração
  return (
    <div className="proposta-container">
      <header className="proposta-header">
        {proposta.escritorios?.logo_url && (
          <img src={proposta.escritorios.logo_url} alt="Logo do Escritório" className="escritorio-logo" />
        )}
        <h1>{proposta.escritorios?.razao_social || 'Escritório de Contabilidade'}</h1>
      </header>

      <main className="proposta-main">
        {/* ... todo o resto do seu JSX da proposta vai aqui, sem alterações ... */}
        <section className="proposta-section cliente-info">
          <h2>Proposta Comercial</h2>
          <p><strong>Para:</strong> {proposta.clientes?.nome_fantasia_ou_nome || proposta.nome_cliente_avulso}</p>
          <p><strong>Data da Proposta:</strong> {new Date(proposta.data_proposta).toLocaleDateString('pt-BR')}</p>
          <p><strong>Validade:</strong> Esta proposta é válida até {dataValidadeFormatada}.</p>
        </section>

        {servicosRecorrentes.length > 0 && (
          <section className="proposta-section servicos-detalhes">
            <h3>Serviços Recorrentes (Mensais)</h3>
            <table className="servicos-tabela">
              <tbody>
                {servicosRecorrentes.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nome_servico}</td>
                    <td className="valor">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_servico)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {servicosEventuais.length > 0 && (
          <section className="proposta-section servicos-detalhes">
            <h3>Serviços Eventuais (Pagamento Único)</h3>
            <table className="servicos-tabela">
              <tbody>
                {servicosEventuais.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nome_servico}</td>
                    <td className="valor">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_servico)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="proposta-section resumo-financeiro">
          <h3>Resumo Financeiro</h3>
          <div className="resumo-grid">
            <div className="resumo-item">
              <h4>Total Mensal</h4>
              <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.valor_recorrente)}</p>
            </div>
            <div className="resumo-item">
              <h4>Total Eventual</h4>
              <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.valor_eventual)}</p>
            </div>
          </div>
        </section>

        {proposta.condicoes_pagamento && (
          <section className="proposta-section">
            <h3>Condições de Pagamento</h3>
            <p className="pre-wrap">{proposta.condicoes_pagamento}</p>
          </section>
        )}

        {proposta.informacoes_complementares && (
          <section className="proposta-section">
            <h3>Informações Complementares</h3>
            <p className="pre-wrap">{proposta.informacoes_complementares}</p>
          </section>
        )}
      </main>

      <footer className="proposta-footer">
        <button className="btn-acao aceitar">Aceitar Proposta</button>
        <button className="btn-acao recusar">Recusar Proposta</button>
      </footer>
    </div>
  );
}
