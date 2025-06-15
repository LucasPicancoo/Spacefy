import { Request, Response } from 'express';
import { processUserPrompt } from '../services/openaiService';
import redisConfig from '../config/redisConfig';

export const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: 'Prompt é obrigatório' });
      return 
    }

    // Tenta obter os dados do cache
    const cacheKey = `openai_chat_${prompt}`;
    const cachedResponse = await redisConfig.getRedis(cacheKey);
    
    if (cachedResponse) {
      res.json(JSON.parse(cachedResponse));
      return;
    }

    const filtros = await processUserPrompt(prompt);

    // Salva a resposta no cache por 5 minutos
    await redisConfig.setRedis(cacheKey, JSON.stringify(filtros), 300);

    res.json(filtros);
    return 
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      error: 'Erro ao processar o prompt',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    return 
  }
};
