import mongoose, { Schema } from "mongoose";
import { ISpace } from "../types/space"; // ajusta o caminho conforme a estrutura do seu projeto

const SpaceSchema: Schema = new Schema({
  id_espaco: { type: Number, required: true, unique: true },
  nome_espaco: { type: String, required: true },
  num_maximo_pessoas: { type: Number, required: true },
  localizacao: { type: String, required: true },
  tipo_espaco: { type: String, required: true },
  descricao_espaco: { type: String },
  preco_hora: { type: Number, required: true },
  nome_propri: { type: String, required: true },
  cpf: { type: Number },
  cnpj: { type: Number },
  tel_propri: { type: String, required: true },

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
  email: { type: String, required: true },
  image_url: { type: String, required: true }, // URL da imagem do espaço (obrigatório)
});

SpaceSchema.pre<ISpace>("save", async function (next) {
  if (!this.space_name || !this.location || !this.space_type) {
    throw new Error("Os campos Nome do Espaço, localização e Tipo do Espaço são obrigatórios.");
  }

  if (!this.document_number) {
    throw new Error("O campo CPF/CNPJ é obrigatório.");
  }

  const isCPF = this.document_number.length === 11 && /^\d{11}$/.test(this.document_number);
  const isCNPJ = this.document_number.length === 14 && /^\d{14}$/.test(this.document_number);

  if (!isCPF && !isCNPJ) {
    throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
  }

  next();
});

export default mongoose.model<ISpace>("Space", SpaceSchema);
