import mongoose, { Schema } from "mongoose";
import { ISpace } from "../types/space"; // ajusta o caminho conforme a estrutura do seu projeto
import { ALLOWED_AMENITIES } from "../constants/amenities";
import { ALLOWED_RULES } from "../constants/spaceRules";
import { ALLOWED_SPACE_TYPES } from "../constants/spaceTypes";

const SpaceSchema: Schema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // ID do locador (obrigatório)
  space_name: { type: String, required: true }, // Nome do espaço (obrigatório)
  max_people: { type: Number, required: true }, // Capacidade máxima de pessoas (obrigatório)
  location: {
    formatted_address: { type: String, required: true },
    place_id: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  space_type: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value: string) {
        return ALLOWED_SPACE_TYPES.includes(value);
      },
      message: "Tipo de espaço inválido"
    }
  },
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
  weekly_days: [{
    day: { 
      type: String, 
      required: true,
      enum: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
    },
    time_ranges: [{
      open: { 
        type: String, 
        required: true,
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido (HH:mm)"]
      },
      close: { 
        type: String, 
        required: true,
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido (HH:mm)"]
      }
    }]
  }],
  week_days: { type: [String], required: true },
  price_per_hour: { type: Number, required: true }, // Preço por hora do aluguel (obrigatório)
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
  document_photo: { type: String, required: true }, // Foto do documento do proprietário (obrigatório)
  space_document_photo: { type: String, required: true }, // Foto do documento do espaço (obrigatório)
  owner_phone: { type: String, required: true }, // Telefone do proprietário (obrigatório)
  owner_email: { type: String, required: true },
  image_url: { type: [String], required: true }, // URL da imagem do espaço (obrigatório)
});

SpaceSchema.pre<ISpace>("save", async function (next) {
  if (!this.space_name) {
    throw new Error("O Nome do Espaço não foi informado.");
  }

  if (!this.max_people) {
    throw new Error("O número máximo de pessoas não foi informado.");
  }

  if (!this.location?.formatted_address || !this.location?.place_id) {
    throw new Error("Todos os campos do endereço são obrigatórios.");
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

  if (!this.weekly_days || this.weekly_days.length === 0) {
    throw new Error("Os dias da semana e horários não foram informados.");
  }

  // Validação dos horários
  for (const day of this.weekly_days) {
    if (!day.time_ranges || day.time_ranges.length === 0) {
      throw new Error(`Nenhum horário definido para ${day.day}`);
    }

    for (const range of day.time_ranges) {
      const openTime = new Date(`2000-01-01T${range.open}`);
      const closeTime = new Date(`2000-01-01T${range.close}`);
      
      // Se o horário de fechamento for menor que o de abertura, assumimos que é no dia seguinte
      if (closeTime <= openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }
    }
  }

  if (!this.owner_name) {
    throw new Error("O nome do proprietário não foi informado.");
  }

  const isCPF = this.document_number.length === 11 && /^\d{11}$/.test(this.document_number);
  const isCNPJ = this.document_number.length === 14 && /^\d{14}$/.test(this.document_number);

  if (!isCPF && !isCNPJ) {
    throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
  }

  if (!this.document_photo) {
    throw new Error("A foto do documento do proprietário não foi informada.");
  }

  if (!this.space_document_photo) {
    throw new Error("A foto do documento do espaço não foi informada.");
  }

  next();
});


export default mongoose.model<ISpace>("Space", SpaceSchema);
