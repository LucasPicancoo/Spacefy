import { Request, Response } from "express";
import BlockedDatesModel from "../models/blockedDatesModel";
import mongoose from "mongoose";
import RentalModel from "../models/rentalModel";
import redisConfig from "../config/redisConfig";

// Criar ou atualizar datas bloqueadas
export const createOrUpdateBlockedDates = async (req: Request, res: Response) => {
  try {
    const { space_id, blocked_dates } = req.body;

    // Validação do ID do espaço
    if (!space_id || !mongoose.Types.ObjectId.isValid(space_id)) {
      res.status(400).json({ error: "ID do espaço inválido ou não fornecido" });
      return;
    }

    // Validação das datas
    if (!Array.isArray(blocked_dates)) {
      res.status(400).json({ error: "É necessário fornecer um array de datas bloqueadas" });
      return;
    }

    // Converte as strings de data para objetos Date e valida
    const formattedDates = blocked_dates.map(date => new Date(date));
    
    // Verifica se há datas inválidas
    const invalidDates = formattedDates.filter(date => isNaN(date.getTime()));
    if (invalidDates.length > 0) {
      res.status(400).json({ error: "Formato de data inválido" });
      return;
    }

    // Verifica se há datas do passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastDates = formattedDates.filter(date => date < today);
    if (pastDates.length > 0) {
      res.status(400).json({ error: "Não é possível bloquear datas do passado" });
      return;
    }

    // Remove datas duplicadas
    const uniqueDates = formattedDates.filter((date, index, self) =>
      index === self.findIndex((d) => d.getTime() === date.getTime())
    );

    // Busca ou cria um novo registro de datas bloqueadas
    const blockedDates = await BlockedDatesModel.findOneAndUpdate(
      { space_id: new mongoose.Types.ObjectId(space_id) },
      { 
        space_id: new mongoose.Types.ObjectId(space_id),
        blocked_dates: uniqueDates
      },
      { 
        new: true,
        upsert: true,
        select: 'space_id blocked_dates'
      }
    );

    // Invalida o cache das datas bloqueadas e reservadas
    await Promise.all([
      redisConfig.deleteRedis(`blocked_dates_${space_id}`),
      redisConfig.deleteRedisPattern(`rented_dates_${space_id}_*`)
    ]);

    res.status(200).json(blockedDates);
    return;
  } catch (error) {
    console.error("Erro ao criar/atualizar datas bloqueadas:", error);
    res.status(500).json({ 
      error: "Erro ao criar/atualizar datas bloqueadas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
};

// Obter datas bloqueadas por ID do espaço
export const getBlockedDatesBySpaceId = async (req: Request, res: Response) => {
  try {
    const { space_id } = req.params;

    // Validação do ID do espaço
    if (!mongoose.Types.ObjectId.isValid(space_id)) {
      res.status(400).json({ error: "ID do espaço inválido" });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `blocked_dates_${space_id}`;
    const cachedDates = await redisConfig.getRedis(cacheKey);
    
    if (cachedDates) {
      res.status(200).json(JSON.parse(cachedDates));
      return;
    }

    // Buscar datas bloqueadas
    const blockedDates = await BlockedDatesModel.findOne({ space_id })
      .populate({
        path: 'space_id',
        select: 'owner_id',
        populate: {
          path: 'owner_id',
          select: '_id'
        }
      })
      .select('space_id blocked_dates');

    // Buscar datas reservadas
    const rentals = await RentalModel.find({ space: space_id })
      .select("start_date end_date startTime endTime");

    // Criar um mapa para agrupar os horários por data das reservas
    const dateMap = new Map();

    rentals.forEach(rental => {
      const datesBetween = getDatesBetween(rental.start_date, rental.end_date);
      
      datesBetween.forEach(date => {
        const dateStr = date.toISOString().split("T")[0];
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, []);
        }
        dateMap.get(dateStr).push({
          startTime: rental.startTime,
          endTime: rental.endTime
        });
      });
    });

    // Converter o mapa para o formato de resposta desejado
    const formattedRentedDates = Array.from(dateMap.entries()).map(([date, times]) => ({
      date,
      times: times.map((time: { startTime: string; endTime: string }) => ({
        startTime: time.startTime,
        endTime: time.endTime
      }))
    }));

    // Preparar a resposta
    const response = {
      blocked_dates: blockedDates?.blocked_dates || [],
      rented_dates: formattedRentedDates
    };

    // Salva a resposta no cache por 5 minutos
    await redisConfig.setRedis(cacheKey, JSON.stringify(response), 300);

    res.status(200).json(response);
    return;
  } catch (error) {
    console.error("Erro ao buscar datas bloqueadas e reservadas:", error);
    res.status(500).json({ 
      error: "Erro ao buscar datas bloqueadas e reservadas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
};

// Função auxiliar para obter todas as datas entre duas datas
function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
} 