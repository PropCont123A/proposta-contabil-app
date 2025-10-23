// types/database.types.ts

export interface Escritorio {
  id: string;
  user_id: string;
  tipo_pessoa: 'Física' | 'Jurídica';
  cpf_cnpj: string;
  crc: string;
  razao_social: string;
  nome_fantasia?: string; // O '?' indica que o campo é opcional
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  fone_comercial: string;
  whatsapp: string;
  email: string;
  logo_url?: string;
  site?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  sobre_nos?: string;
  contador_responsavel_nome: string;
  contador_responsavel_cpf: string;
  contador_responsavel_crc: string;
  created_at: string;
}
