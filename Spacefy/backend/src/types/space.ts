import { Document } from "mongoose";

export interface ISpace extends Document {
  id_espaco: number;
  nome_espaco: string;
  num_maximo_pessoas: number;
  localizacao: string;
  tipo_espaco: string;
  descricao_espaco: string;
  preco_hora: number;
  nome_propri: string;
  cpf?: number;
  cnpj?: number;
  tel_propri: string;
  space_name: string; // Nome do espaço
  max_people: number; // Capacidade máxima de pessoas
  location: string; // Localização do espaço
  space_type: string; // Tipo do espaço (ex.: court, hall, auditorium)
  space_description: string; // Descrição opcional do espaço
  price_per_hour: number; // Preço por hora do aluguel
  owner_name: string; // Nome do proprietário
  document_number: string; // CPF ou CNPJ do proprietário
  owner_phone: string; // Telefone do proprietário
  email: string;
  image_url: string;
}
