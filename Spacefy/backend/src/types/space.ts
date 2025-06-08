// Importa os tipos Document e ObjectId do Mongoose para definir a estrutura dos documentos no banco de dados
import { Document, ObjectId } from "mongoose";

// Interface para espaços, representando os campos comuns a todos os espaços
export interface ISpace extends Document {
  _id: ObjectId; // ID do espaço
  owner_id: ObjectId; // ID do locador
  space_name: string; // Nome do espaço
  max_people: number; // Capacidade máxima de pessoas
  location: {
    formatted_address: string;
    place_id: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  space_type: string; // Tipo do espaço (ex.: quadra, salão, auditório)
  space_description: string; // Descrição opcional do espaço
  space_amenities: string[]; // Comodidades do espaço
  weekly_days: {
    day: string;
    time_ranges: {
      open: string;
      close: string;
    }[];
  }[]; // Dias da semana e horários disponíveis
  week_days: string[]; // Mantido para compatibilidade
  space_rules: string[]; // Regras do espaço
  price_per_hour: number; // Preço por hora do aluguel
  owner_name: string; // Nome do proprietário
  document_number: string; // CPF ou CNPJ do proprietário
  document_photo: string; // Foto do documento do proprietário
  space_document_photo: string; // Foto do documento do espaço
  owner_phone: string; // Telefone do proprietário
  owner_email: string; // E-mail do proprietário
  image_url: string[]; // URL da imagem do espaço
}