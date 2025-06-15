import { Request, Response } from "express";
import RentalModel from "../models/rentalModel";
import NotificationModel from "../models/notificationModel";
import SpaceModel from "../models/spaceModel";
import UserModel from "../models/userModel";
import mongoose from "mongoose";
import redisConfig from "../config/redisConfig";

// Função para calcular o número de dias entre duas datas
const calculateDays = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia inicial
};

// Função para calcular o número de horas entre dois horários
const calculateHours = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  return hours + (minutes / 60);
};

// Função para calcular o valor total da reserva
const calculateTotalValue = (
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  hourlyRate: number
): number => {
  const days = calculateDays(startDate, endDate);
  const hoursPerDay = calculateHours(startTime, endTime);
  return days * hoursPerDay * hourlyRate;
};

// Função para verificar se há conflito de horário
const hasTimeConflict = (
  existingStartDate: Date,
  existingEndDate: Date,
  existingStartTime: string,
  existingEndTime: string,
  newStartDate: Date,
  newEndDate: Date,
  newStartTime: string,
  newEndTime: string
) => {
  // Se as datas não se sobrepõem, não há conflito
  if (newEndDate < existingStartDate || newStartDate > existingEndDate) {
    return false;
  }

  // Se for o mesmo dia, verifica o horário
  if (
    newStartDate.getTime() === newEndDate.getTime() &&
    existingStartDate.getTime() === existingEndDate.getTime() &&
    newStartDate.getTime() === existingStartDate.getTime()
  ) {
    return (
      (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
      (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
      (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
    );
  }

  // Se as datas se sobrepõem, há conflito
  return true;
};

// Função para converter data do formato YYYY-MM-DD para Date
const convertDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Função para gerar array de datas entre duas datas
const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Criar um novo aluguel com validação de conflito + notificação automática
export const createRental = async (req: Request, res: Response) => {
  try {
    const { userId, spaceId, start_date, end_date, startTime, endTime, value } = req.body;

    if (!userId || !spaceId || !start_date || !end_date || !startTime || !endTime || !value) {
      res.status(400).json({ error: "Todos os campos são obrigatórios." });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(spaceId)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    // Buscar o espaço para obter o ID do locador
    const space = await SpaceModel.findById(spaceId).select("owner_id space_name");
    if (!space) {
      res.status(404).json({ error: "Espaço não encontrado." });
      return;
    }

    // Verificar se o usuário existe
    const user = await UserModel.findById(userId).select("name");
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    const convertedStartDate = convertDate(start_date);
    const convertedEndDate = convertDate(end_date);

    const rentalsOnSameSpace = await RentalModel.find({
      space: spaceId,
      $or: [
        {
          start_date: { $lte: convertedEndDate },
          end_date: { $gte: convertedStartDate },
        },
      ],
    });

    for (const rental of rentalsOnSameSpace) {
      if (
        hasTimeConflict(
          rental.start_date,
          rental.end_date,
          rental.startTime,
          rental.endTime,
          convertedStartDate,
          convertedEndDate,
          startTime,
          endTime
        )
      ) {
        res.status(409).json({
          error: "Conflito de horário: já existe um aluguel nesse espaço neste período.",
        });
        return;
      }
    }

    const rental = new RentalModel({
      user: userId,
      space: spaceId,
      owner: space.owner_id,
      start_date: convertedStartDate,
      end_date: convertedEndDate,
      startTime,
      endTime,
      value,
    });

    await rental.save();

    // Invalida todos os caches relacionados a aluguéis
    await Promise.all([
      redisConfig.deleteRedisPattern('rentals_all_*'),
      redisConfig.deleteRedisPattern(`rentals_user_${userId}_*`),
      redisConfig.deleteRedisPattern(`rentals_owner_${space.owner_id}_*`),
      redisConfig.deleteRedisPattern(`rentals_space_${spaceId}_*`),
      redisConfig.deleteRedisPattern(`rented_dates_${spaceId}_*`)
    ]);

    const spaceName = space.space_name || "espaço";
    const userName = user.name || "Usuário";

    // Criar notificação para o usuário que alugou
    await NotificationModel.create({
      user: userId,
      title: "Aluguel criado com sucesso",
      message: `Seu aluguel para o espaço "${spaceName}" foi criado com sucesso de ${start_date} até ${end_date}.`,
    });

    // Criar notificação para o locador
    await NotificationModel.create({
      user: space.owner_id,
      title: "Novo aluguel do seu espaço",
      message: `${userName} alugou seu espaço "${spaceName}" de ${start_date} até ${end_date}.`,
    });

    res.status(201).json(rental);
    return;
  } catch (error) {
    console.error("Erro detalhado ao criar aluguel:", error);
    res.status(500).json({ 
      error: "Erro interno ao criar aluguel.",
      details: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined
    });
    return;
  }
};

// Listar todos os aluguéis com filtro opcional por data e espaço
export const getAllRentals = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, spaceId } = req.query;

    // Cria uma chave única para o cache baseada nos filtros
    const cacheKey = `rentals_all_${JSON.stringify(req.query)}`;
    const cachedRentals = await redisConfig.getRedis(cacheKey);
    
    if (cachedRentals) {
      res.status(200).json(JSON.parse(cachedRentals));
      return;
    }

    const filter: any = {};
    if (start_date) filter.start_date = { $gte: convertDate(start_date as string) };
    if (end_date) filter.end_date = { $lte: convertDate(end_date as string) };
    if (spaceId && mongoose.Types.ObjectId.isValid(spaceId as string)) {
      filter.space = spaceId;
    }

    const rentals = await RentalModel.find(filter)
      .populate("user", "name email")
      .populate("space", "name location");

    await redisConfig.setRedis(cacheKey, JSON.stringify(rentals), 300);

    res.status(200).json(rentals);
    return;
  } catch (error) {
    console.error("Erro ao buscar aluguéis:", error);
    res.status(500).json({ error: "Erro interno ao buscar aluguéis." });
    return;
  }
};

// Listar aluguéis de um usuário específico
export const getRentalsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "ID de usuário inválido." });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `rentals_user_${userId}`;
    const cachedRentals = await redisConfig.getRedis(cacheKey);
    
    if (cachedRentals) {
      res.status(200).json(JSON.parse(cachedRentals));
      return;
    }

    const rentals = await RentalModel.find({ user: userId }).populate(
      "space",
      "space_name image_url price_per_hour location"
    );

    await redisConfig.setRedis(cacheKey, JSON.stringify(rentals), 300);

    res.status(200).json(rentals);
    return;
  } catch (error) {
    console.error("Erro ao buscar aluguéis do usuário:", error);
    res.status(500).json({ error: "Erro interno ao buscar aluguéis." });
    return;
  }
};

// Deletar aluguel pelo ID
export const deleteRental = async (req: Request, res: Response) => {
  try {
    const { rentalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(rentalId)) {
      res.status(400).json({ error: "ID de aluguel inválido." });
      return;
    }

    const deleted = await RentalModel.findByIdAndDelete(rentalId);

    if (!deleted) {
      res.status(404).json({ error: "Aluguel não encontrado." });
      return;
    }

    // Invalida todos os caches relacionados ao aluguel deletado
    await Promise.all([
      redisConfig.deleteRedisPattern('rentals_all_*'),
      redisConfig.deleteRedisPattern(`rentals_user_${deleted.user}_*`),
      redisConfig.deleteRedisPattern(`rentals_owner_${deleted.owner}_*`),
      redisConfig.deleteRedisPattern(`rentals_space_${deleted.space}_*`),
      redisConfig.deleteRedisPattern(`rented_dates_${deleted.space}_*`)
    ]);

    res.status(200).json({ message: "Aluguel deletado com sucesso." });
    return;
  } catch (error) {
    console.error("Erro ao deletar aluguel:", error);
    res.status(500).json({ error: "Erro interno ao deletar aluguel." });
    return;
  }
};

// Listar todas as datas reservadas de um espaço específico
export const getRentedDatesBySpace = async (req: Request, res: Response) => {
  try {
    const { spaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      res.status(400).json({ error: "ID de espaço inválido." });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `rented_dates_${spaceId}`;
    const cachedDates = await redisConfig.getRedis(cacheKey);
    
    if (cachedDates) {
      res.status(200).json(JSON.parse(cachedDates));
      return;
    }

    const rentals = await RentalModel.find({ space: spaceId }).select("start_date end_date startTime endTime");

    if (!rentals.length) {
      const emptyResponse = { dates: [] };
      await redisConfig.setRedis(cacheKey, JSON.stringify(emptyResponse), 300);
      res.status(200).json(emptyResponse);
      return;
    }

    // Criar um mapa para agrupar os horários por data
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
    const formattedDates = Array.from(dateMap.entries()).map(([date, times]) => ({
      date,
      times: times.map((time: { startTime: string; endTime: string }) => ({
        startTime: time.startTime,
        endTime: time.endTime
      }))
    }));

    console.log('Datas formatadas:', formattedDates); // Debug

    await redisConfig.setRedis(cacheKey, JSON.stringify({ dates: formattedDates }), 300);

    res.status(200).json({ dates: formattedDates });
    return;
  } catch (error) {
    console.error("Erro ao buscar datas reservadas:", error);
    res.status(500).json({ error: "Erro interno ao buscar datas reservadas." });
    return;
  }
};

// Listar aluguéis de um locador específico
export const getRentalsByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      res.status(400).json({ error: "ID do locador inválido." });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `rentals_owner_${ownerId}`;
    const cachedRentals = await redisConfig.getRedis(cacheKey);
    
    if (cachedRentals) {
      res.status(200).json(JSON.parse(cachedRentals));
      return;
    }

    const rentals = await RentalModel.find({ owner: ownerId })
      .populate({
        path: 'user',
        select: 'name surname email',
        model: 'user'
      })
      .populate("space", "space_name image_url price_per_hour location")
      .lean();

    // Transformar os resultados para incluir os dados do usuário de forma estruturada
    const formattedRentals = rentals.map(rental => {
      const rentalObj = rental as any;
      return {
        ...rentalObj,
        user: {
          _id: rentalObj.user?._id || rentalObj.user,
          name: rentalObj.user?.name || '',
          surname: rentalObj.user?.surname || '',
          email: rentalObj.user?.email || ''
        }
      };
    });

    await redisConfig.setRedis(cacheKey, JSON.stringify(formattedRentals), 300);

    res.status(200).json(formattedRentals);
    return;
  } catch (error) {
    console.error("Erro ao buscar aluguéis do locador:", error);
    res.status(500).json({ error: "Erro interno ao buscar aluguéis." });
    return;
  }
};
