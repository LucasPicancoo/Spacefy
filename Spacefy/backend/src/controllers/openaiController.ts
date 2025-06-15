import { Request, Response } from 'express';
import { processUserPrompt } from '../services/openaiService';

export const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: 'Prompt é obrigatório' });
      return 
    }

    const filtros = await processUserPrompt(prompt);
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
