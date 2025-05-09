import mongoose, { Schema } from "mongoose";
import { ISpace } from "../types/space"; // ajusta o caminho conforme a estrutura do seu projeto
import { ALLOWED_AMENITIES } from "../constants/amenities";
import { ALLOWED_RULES } from "../constants/spaceRules";

const SpaceSchema: Schema = new Schema({
  space_name: { type: String, required: true }, // Nome do espaço (obrigatório)
  max_people: { type: Number, required: true }, // Capacidade máxima de pessoas (obrigatório)
  location: { type: String, required: true }, // Localização do espaço (obrigatório)
  space_type: { type: String, required: true }, // Tipo do espaço (obrigatório)
  space_description: { type: String, maxlength: 500 }, // Descrição do espaço (opcional, máximo de 500 caracteres)}, // Descrição do espaço (opcional)
  space_amenities: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(amenities: string[]) {
        return amenities.every(amenity => ALLOWED_AMENITIES.includes(amenity));
      },
      message: "Uma ou mais comodidades não são permitidas."
    }
  },
  week_days: { type: [String], required: true },
  opening_time: { type: String, required: true },
  price_per_hour: { type: Number, required: true }, // Preço por hora do aluguel (obrigatório)
  closing_time: { type: String, required: true },
  space_rules: { 
    type: [String], 
    required: false,
    default: [],
    validate: {
      validator: function(rules: string[]) {
        return rules.every(rule => ALLOWED_RULES.includes(rule));
      },
      message: "Uma ou mais regras não são permitidas."
    }
  },
  owner_name: { type: String, required: true }, // Nome do proprietário (obrigatório)
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
  owner_email: { type: String, required: true },
  image_url: { type: String, required: true }, // URL da imagem do espaço (obrigatório)
});

SpaceSchema.pre<ISpace>("save", async function (next) {
  if (!this.space_name) {
    throw new Error("O Nome do Espaço não foi informado.");
  }

  if (!this.max_people) {
    throw new Error("O número máximo de pessoas não foi informado.");
  }

  if (!this.location) {
    throw new Error("A URL de localização do espaço não foi informada.");
  }

  if (!this.price_per_hour) {
    throw new Error("O preço por hora não foi informado.");
  }

  if (!this.space_type) {
    throw new Error("O tipo de espaço não foi informado.");
  }

  if (!this.document_number) {
    throw new Error("O campo CPF/CNPJ é obrigatório.");
  }

  if (!this.space_amenities){
    throw new Error("Selecione pelo menos uma comodidade.")
  }

  if (!this.week_days) {
    throw new Error("Os dias da semana não foram informados.");
  }

  if (!this.opening_time) {
    throw new Error("O horário de abertura não foi informado.");
  }

  if (!this.closing_time) {
    throw new Error("O horário de fechamento não foi informado.");
  }

  if (!this.owner_name) {
    throw new Error("O nome do proprietário não foi informado.");
  }

  const isCPF = this.document_number.length === 11 && /^\d{11}$/.test(this.document_number);
  const isCNPJ = this.document_number.length === 14 && /^\d{14}$/.test(this.document_number);

  if (!isCPF && !isCNPJ) {
    throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
  }

  next();
});

export default mongoose.model<ISpace>("Space", SpaceSchema);
