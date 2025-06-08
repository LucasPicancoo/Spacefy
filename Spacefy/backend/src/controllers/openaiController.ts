import { Request, Response } from 'express';
import { processUserPrompt } from '../services/openaiService';

export const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const filtros = await processUserPrompt(prompt);
    return res.json(filtros);
  } catch (error) {
    console.error('Erro detalhado:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar o prompt',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
