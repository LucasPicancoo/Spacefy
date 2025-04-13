// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";

// Define a interface base para os atributos de um espaço
export interface ISpace extends Document {
  space_name: string; // Nome do espaço
  max_people: number; // Capacidade máxima de pessoas
  location: string; // Localização do espaço
  space_type: string; // Tipo do espaço (ex.: court, hall, auditorium)
  space_description: string; // Descrição opcional do espaço
  price_per_hour: number; // Preço por hora do aluguel
  owner_name: string; // Nome do proprietário
  document_number: string; // CPF ou CNPJ do proprietário
  owner_phone: string; // Telefone do proprietário
  email: string; // E-mail do proprietário
  image_url: string; // URL da imagem do espaço (obrigatório)
}

// Define o esquema do espaço no MongoDB, incluindo validações e atributos
const SpaceSchema: Schema = new Schema({
  space_name: { 
    type: String, 
    required: true 
  }, // Nome do espaço (obrigatório)

  max_people: { 
    type: Number, 
    required: true 
  }, // Capacidade máxima de pessoas (obrigatório)

  location: { 
    type: String, 
    required: true 
  }, // Localização do espaço (obrigatório)

  space_type: { 
    type: String, 
    required: true 
  }, // Tipo do espaço (obrigatório)

  space_description: { 
    type: String,
    maxlength: 500 // Descrição do espaço (opcional, máximo de 500 caracteres)
  }, // Descrição do espaço (opcional)

  price_per_hour: { 
    type: Number, 
    required: true 
  }, // Preço por hora do aluguel (obrigatório)

  owner_name: { 
    type: String, 
    required: true 
  }, // Nome do proprietário (obrigatório)

  document_number: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (value: string) {
        // Validação para CPF (11 dígitos) ou CNPJ (14 dígitos)
        const isCPF = value.length === 11 && /^\d{11}$/.test(value);
        const isCNPJ = value.length === 14 && /^\d{14}$/.test(value);
        return isCPF || isCNPJ;
      },

      message: "O campo CPF/CNPJ deve conter um CPF válido (11 dígitos) ou um CNPJ válido (14 dígitos)."
    }
  }, // CPF ou CNPJ do proprietário (obrigatório)
  owner_phone: { type: String, required: true }, // Telefone do proprietário (obrigatório)
  email: { type: String, required: true }, // E-mail do proprietário (obrigatório)
  image_url: { type: String, required: true }, // URL da imagem do espaço (obrigatório)
});

// Middleware que pode ser usado para validações ou transformações antes de salvar
SpaceSchema.pre<ISpace>("save", async function (next) {
  // Validação: Campos obrigatórios
  if (!this.space_name || !this.location || !this.space_type) {
    throw new Error("Os campos Nome do Espaço, localização e Tipo do Espaço são obrigatórios.");
  }

  // Validação: CPF ou CNPJ deve ser informado e válido
  if (!this.document_number) {
    throw new Error("O campo CPF/CNPJ é obrigatório.");
  }

  const isCPF = this.document_number.length === 11 && /^\d{11}$/.test(this.document_number);
  const isCNPJ = this.document_number.length === 14 && /^\d{14}$/.test(this.document_number);

  if (!isCPF && !isCNPJ) {
    throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
  }

  next(); // Continua o fluxo de execução
});

// Exporta o modelo "Space" baseado no esquema SpaceSchema
export default mongoose.model<ISpace>("Space", SpaceSchema);