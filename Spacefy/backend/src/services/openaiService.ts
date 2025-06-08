import { OpenAI } from 'openai';
import { ALLOWED_AMENITIES } from '../constants/amenities';
import { ALLOWED_RULES } from '../constants/spaceRules';
import { ALLOWED_SPACE_TYPES } from '../constants/spaceTypes';

// Verificar se a chave da API está configurada
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY não está configurada nas variáveis de ambiente');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const processUserPrompt = async (prompt: string) => {
  try {
    const systemPrompt = `
    Você é um assistente virtual que transforma pedidos de espaços em filtros de busca.
    Você deve retornar um JSON com os seguintes campos:
    - cidade: string (nome da cidade)
    - comodidades: string[] (lista de comodidades)
    - tipo_espaco: string (tipo do espaço)
    - regras: string[] (lista de regras)

    Comodidades permitidas: ${ALLOWED_AMENITIES.join(', ')}
    Regras permitidas: ${ALLOWED_RULES.join(', ')}
    Tipos de espaço permitidos: ${ALLOWED_SPACE_TYPES.join(', ')}

    Importante:
    1. Use APENAS as comodidades, regras e tipos de espaço listados acima
    2. Se uma comodidade, regra ou tipo não estiver na lista, não a inclua
    3. Retorne um JSON válido com os campos mencionados
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const resposta = completion.choices[0]?.message?.content;
    
    if (!resposta) {
      throw new Error('Nenhuma resposta recebida da OpenAI');
    }

    const parsedResponse = JSON.parse(resposta);
    return parsedResponse;
  } catch (error) {
    console.error('Erro no processamento do prompt:', error);
    throw error;
  }
};
