// Importa os tipos Document e ObjectId do Mongoose para definir a estrutura dos documentos no banco de dados
import { Document, ObjectId } from "mongoose";

// Interface para espaços, representando os campos comuns a todos os espaços
export interface ISpace extends Document {
  _id: ObjectId; // ID do espaço
  space_name: string; // Nome do espaço
  max_people: number; // Capacidade máxima de pessoas
  location: string; // Localização do espaço
  space_type: string; // Tipo do espaço (ex.: quadra, salão, auditório)
  space_description: string; // Descrição opcional do espaço
  space_amenities: string[]; // Comodidades do espaço
  week_days: string[]; // Dias da semana que o espaço está disponível
  opening_time: string; // Horário de abertura do espaço (formato HH:mm)
  closing_time: string; // Horário de fechamento do espaço (formato HH:mm)
  price_per_hour: number; // Preço por hora do aluguel
  owner_name: string; // Nome do proprietário
  document_number: string; // CPF ou CNPJ do proprietário
  owner_phone: string; // Telefone do proprietário
  owner_email: string; // E-mail do proprietário
  image_url: string; // URL da imagem do espaço
}