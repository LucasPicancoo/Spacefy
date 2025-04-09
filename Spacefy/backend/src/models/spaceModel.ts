// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";

// Define a interface base para os atributos de um espaço
export interface ISpace extends Document {
  id_espaco: number; // ID do espaço
  nome_espaco: string; // Nome do espaço
  num_maximo_pessoas: number; // Capacidade máxima de pessoas
  localizacao: string; // Localização do espaço
  tipo_espaco: string; // Tipo do espaço (ex.: quadra, salão, auditório)
  descricao_espaco: string; // Descrição opcional do espaço
  preco_hora: number; // Preço por hora do aluguel
  nome_propri: string; // Nome do proprietário
  cpf?: number; // CPF do proprietário (opcional)
  cnpj?: number; // CNPJ do proprietário (opcional)
  tel_propri: string; // Telefone do proprietário
  email: string; // E-mail do proprietário
}

// Define o esquema do espaço no MongoDB, incluindo validações e atributos
const SpaceSchema: Schema = new Schema({
  id_espaco: { type: Number, required: true, unique: true }, // ID do espaço (obrigatório e único)
  nome_espaco: { type: String, required: true }, // Nome do espaço (obrigatório)
  num_maximo_pessoas: { type: Number, required: true }, // Capacidade máxima de pessoas (obrigatório)
  localizacao: { type: String, required: true }, // Localização do espaço (obrigatório)
  tipo_espaco: { type: String, required: true }, // Tipo do espaço (obrigatório)
  descricao_espaco: { type: String }, // Descrição do espaço (opcional)
  preco_hora: { type: Number, required: true }, // Preço por hora do aluguel (obrigatório)
  nome_propri: { type: String, required: true }, // Nome do proprietário (obrigatório)
  cpf: { type: Number }, // CPF do proprietário (opcional)
  cnpj: { type: Number }, // CNPJ do proprietário (opcional)
  tel_propri: { type: String, required: true }, // Telefone do proprietário (obrigatório)
  email: { type: String, required: true }, // E-mail do proprietário (obrigatório)
});

// Middleware que pode ser usado para validações ou transformações antes de salvar
SpaceSchema.pre<ISpace>("save", async function (next) {
  // Validação: Campos obrigatórios
  if (!this.nome_espaco || !this.localizacao || !this.tipo_espaco) {
    throw new Error("Os campos nome_espaco, localizacao e tipo_espaco são obrigatórios.");
  }

  // Validação: CPF ou CNPJ deve ser informado
  if (!this.cpf && !this.cnpj) {
    throw new Error("Pelo menos um dos campos CPF ou CNPJ deve ser informado.");
  }

  // Validação: CPF deve conter 11 dígitos
  if (this.cpf && this.cpf.toString().length !== 11) {
    throw new Error("O CPF deve conter 11 dígitos.");
  }

  // Validação: CNPJ deve conter 14 dígitos
  if (this.cnpj && this.cnpj.toString().length !== 14) {
    throw new Error("O CNPJ deve conter 14 dígitos.");
  }

  next(); // Continua o fluxo de execução
});

// Exporta o modelo "Space" baseado no esquema SpaceSchema
export default mongoose.model<ISpace>("Space", SpaceSchema);

// Define o esquema para imagens relacionadas aos espaços
const ImageSchema: Schema = new Schema({
  id_espaco: { type: Schema.Types.ObjectId, ref: "Space", required: true }, // Relacionamento com o espaço
  url: { type: String, required: true }, // URL ou caminho da imagem
  descricao: { type: String }, // Descrição opcional da imagem
  criado_em: { type: Date, default: Date.now }, // Data de criação
});

// Exporta o modelo "Image" baseado no esquema ImageSchema
export const ImageModel = mongoose.model("Image", ImageSchema);