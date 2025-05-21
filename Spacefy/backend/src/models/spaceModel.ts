import mongoose, { Schema } from "mongoose";
import { ISpace } from "../types/space";
import { ALLOWED_AMENITIES } from "../constants/amenities";
import { ALLOWED_RULES } from "../constants/spaceRules";
import { ALLOWED_SPACE_TYPES } from "../constants/spaceTypes";

const SpaceSchema: Schema = new Schema({
  space_name: { type: String, required: true }, // Nome do espaço (obrigatório)
  max_people: { type: Number, required: true }, // Capacidade máxima de pessoas (obrigatório)
  address: { type: String, required: true }, // Endereço (obrigatório)
  number: { type: String, required: true }, // Número (obrigatório)
  neighborhood: { type: String, required: true }, // Bairro (obrigatório)
  city: { type: String, required: true }, // Cidade (obrigatório)
  state: { type: String, required: true }, // Estado (obrigatório)
  cep: { type: String, required: true }, // CEP (obrigatório)
  space_type: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return ALLOWED_SPACE_TYPES.includes(value);
      },
      message: "Tipo de espaço inválido",
    },
  },
  space_description: { type: String, maxlength: 500 }, // Descrição do espaço (opcional, máximo de 500 caracteres)
  space_amenities: {
    type: [String],
    required: true,
    validate: {
      validator: function (amenities: string[]) {
        return amenities.every((amenity) =>
          ALLOWED_AMENITIES.includes(amenity)
        );
      },
      message: "Uma ou mais comodidades são inválidas",
    },
  },
  space_rules: {
    type: [String],
    validate: {
      validator: function (rules: string[]) {
        return rules.every((rule) => ALLOWED_RULES.includes(rule));
      },
      message: "Uma ou mais regras são inválidas",
    },
  },
});

export default mongoose.model<ISpace>("Space", SpaceSchema);
