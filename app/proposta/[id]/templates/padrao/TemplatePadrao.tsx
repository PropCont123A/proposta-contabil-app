// Caminho: app/proposta/[id]/templates/padrao/TemplatePadrao.tsx
// VERSÃO 9.0 - LÓGICA DE DADOS DO CLIENTE CORRIGIDA E SIMPLIFICADA

'use client'; 

import { useState } from 'react';
import './padrao.css';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaGlobe, FaCalendarAlt, FaHourglassHalf } from 'react-icons/fa';

// A tipagem precisa incluir 'nome_fantasia' do escritório e os dados do cliente
type PropostaCompleta = {
  id: number;
  data_proposta: string;
  valor_recorrente: number;
  valor_eventual: number;
  condicoes_pagamento: string;
  informacoes_complementares: string;
  validade_dias: number;
  escritorios: { 
    razao_social: string; 
    nome_fantasia: string;
    logo_url: string | null;
    template_selecionado: string;
    sobre_nos: string | null;
    site: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    whatsapp: string | null;
  } | null;
  clientes: { 
    nome_fantasia_ou_nome: string; // Este é o nome da EMPRESA
    nome_responsavel: string | null; // Este é o nome do CONTATO
  } | null;
  nome_cliente_avulso: string;
  telefone: string | null; // Este é o telefone do CONTATO
  proposta_itens: { 
    id: number;
    nome_servico: string; 
    valor_servico: number; 
    categoria_servico: 'Recorrente' | 'Eventual';
    descricao_servico: string | null;
  }[];
};


function AccordionItem({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="accordion-item">
      <button className={`accordion-header ${isOpen ? 'active' : ''}`} onClick={onClick}>
        <span>{title}</span>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          <div className="accordion-body">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplatePadrao({ proposta }: { proposta: PropostaCompleta }) {
  const [openAccordion, setOpenAccordion] = useState<string>('cliente');
  const toggleAccordion = (id: string) => setOpenAccordion(openAccordion === id ? '' : id);
  const dataFormatada = new Date(proposta.data_proposta).toLocaleDateString('pt-BR');
  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const servicosRecorrentes = proposta.proposta_itens.filter(item => item.categoria_servico === 'Recorrente');
  const servicosEventuais = proposta.proposta_itens.filter(item => item.categoria_servico === 'Eventual');

  return (
    <div className="template-padrao-container">
      <header className="padrao-header">
        <div className="header-title-tag">Sua proposta por</div>
        <h1>{proposta.escritorios?.nome_fantasia || proposta.escritorios?.razao_social || 'Escritório Contábil'}</h1>
        <div className="header-divider"></div>
        <div className="padrao-header-info">
          <div className="info-item">
            <FaCalendarAlt />
            <span>Data da proposta: {dataFormatada}</span>
          </div>
          <div className="info-item">
            <FaHourglassHalf />
            <span>Validade: {proposta.validade_dias} dias</span>
          </div>
        </div>
      </header>

      <main className="padrao-main">
        {/* ✅✅✅ LÓGICA DE DADOS DO CLIENTE 100% CORRIGIDA ✅✅✅ */}
        <AccordionItem title="Dados do cliente" isOpen={openAccordion === 'cliente'} onClick={() => toggleAccordion('cliente')}>
          {/* Se for um cliente cadastrado, usa os campos específicos. Senão, usa o avulso. */}
          {proposta.clientes ? (
            <>
              {/* Mostra o nome do responsável (contato) se ele existir */}
              {proposta.clientes.nome_responsavel && <p><strong>Cliente:</strong> {proposta.clientes.nome_responsavel}</p>}
              
              {/* Mostra o nome da empresa */}
              <p><strong>Empresa:</strong> {proposta.clientes.nome_fantasia_ou_nome}</p>
            </>
          ) : (
            // Fallback para cliente avulso
            <p><strong>Cliente:</strong> {proposta.nome_cliente_avulso}</p>
          )}
          
          {/* Mostra o telefone, que vem da tabela de propostas */}
          {proposta.telefone && <p><strong>Telefone:</strong> {proposta.telefone}</p>}
        </AccordionItem>

        {/* ... (O resto do código não muda) ... */}
        <AccordionItem title="Serviços" isOpen={openAccordion === 'servicos'} onClick={() => toggleAccordion('servicos')}>
          {proposta.proposta_itens.map(item => (
            <div key={item.id} className="servico-item-padrao">
              <p><strong>{item.nome_servico}</strong> - {formatarMoeda(item.valor_servico)}</p>
              {item.descricao_servico && (
                <ul>
                  {item.descricao_servico.split('\n').map((linha, index) => (
                    linha.trim() && <li key={index}>{linha}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </AccordionItem>

        <AccordionItem title="Condições de pagamento" isOpen={openAccordion === 'condicoes'} onClick={() => toggleAccordion('condicoes')}>
          <h4>Serviços Recorrentes:</h4>
          <ul>
            {servicosRecorrentes.map(item => (
              <li key={item.id}>{item.nome_servico} - {formatarMoeda(item.valor_servico)}</li>
            ))}
          </ul>
          <p><strong>Valor Total dos Serviços Recorrentes: {formatarMoeda(proposta.valor_recorrente)}</strong></p>
            


          <h4>Serviços Eventuais:</h4>
          <ul>
            {servicosEventuais.map(item => (
              <li key={item.id}>{item.nome_servico} - {formatarMoeda(item.valor_servico)}</li>
            ))}
          </ul>
          <p><strong>Valor Total dos Serviços Eventuais: {formatarMoeda(proposta.valor_eventual)}</strong></p>
            


          {proposta.condicoes_pagamento && (
            <>
              <h4>Condições de Pagamento:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{proposta.condicoes_pagamento}</p>
            </>
          )}
          
          {proposta.informacoes_complementares && (
            <>
                

              <h4>Informações Complementares:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{proposta.informacoes_complementares}</p>
            </>
          )}
        </AccordionItem>
      </main>

      <footer className="padrao-footer">
        <div className="marketing-title-wrapper">
            <span className="marketing-title-highlight">O sucesso da sua empresa</span>
            <span className="marketing-title-normal">começa com uma contabilidade de qualidade!</span>
        </div>
        
        <div className="logo-wrapper-circular">
            {proposta.escritorios?.logo_url ? (
                <img src={proposta.escritorios.logo_url} alt="Logo do Escritório" className="padrao-logo-footer" />
            ) : (
                <div className="logo-placeholder-circular">
                    {(proposta.escritorios?.nome_fantasia || proposta.escritorios?.razao_social)?.substring(0, 2).toUpperCase()}
                </div>
            )}
        </div>
        
        <div className="redes-sociais">
          <p>siga nossas redes:</p>
          <div className="icones-sociais">
            {proposta.escritorios?.facebook && <a href={proposta.escritorios.facebook} className="social-link" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>}
            {proposta.escritorios?.instagram && <a href={proposta.escritorios.instagram} className="social-link" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
            {proposta.escritorios?.whatsapp && <a href={`https://wa.me/${proposta.escritorios.whatsapp.replace(/\D/g, ''     )}`} className="social-link" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>}
            {proposta.escritorios?.linkedin && <a href={proposta.escritorios.linkedin} className="social-link" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
            {proposta.escritorios?.site && <a href={proposta.escritorios.site} className="social-link" target="_blank" rel="noopener noreferrer"><FaGlobe /></a>}
          </div>
        </div>

        {proposta.escritorios?.sobre_nos && (
            <div className="sobre-nos-box">
                <p style={{ whiteSpace: 'pre-wrap' }}>{proposta.escritorios.sobre_nos}</p>
            </div>
        )}

        <div className="creditos-finais">
          <p>Orgulhosamente gerado por:</p>
          <a href="https://propostacontabil.com.br/" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://propostacontabil.com.br/wp-content/uploads/2025/07/proposta-contabil-fundo-transparente-768x448.png" 
              alt="Proposta Contábil" 
              className="logo-proposta-contabil"
            />
          </a>
        </div>
      </footer>
    </div>
      );
}
