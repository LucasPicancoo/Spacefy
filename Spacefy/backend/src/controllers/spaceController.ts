import { Request, Response } from "express";
import SpaceModel from "../models/spaceModel";
import { AMENITIES, ALLOWED_AMENITIES } from "../constants/amenities";
import { ALLOWED_RULES } from "../constants/spaceRules";
import mongoose from 'mongoose';
import { GoogleMapsService } from "../services/googleMapsService";
import redisConfig from "../config/redisConfig";

// import { AuthenticationData } from "../types/auth";

// Listar todos os espaços
export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    // Tenta obter os dados do cache
    const cacheKey = 'all_spaces';
    const cachedSpaces = await redisConfig.getRedis(cacheKey);
    
    if (cachedSpaces) {
      res.status(200).json(JSON.parse(cachedSpaces));
      return;
    }

    const spaces = await SpaceModel.find().select('space_name location price_per_hour max_people image_url');

    if (!spaces) {
      res.status(404).json({ error: "Nenhum espaço encontrado" });
      return;
    }

    await redisConfig.setRedis(cacheKey, JSON.stringify(spaces), 300);

    res.status(200).json(spaces);
    return;
  } catch (error) {
    console.error("Erro ao listar espaços:", error);
    res.status(500).json({ error: "Erro ao listar espaços" });
    return;
  }
};

// Obter um espaço por ID
export const getSpaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Tenta obter os dados do cache
    const cacheKey = `space_${id}`;
    const cachedSpace = await redisConfig.getRedis(cacheKey);
    
    if (cachedSpace) {
      res.status(200).json(JSON.parse(cachedSpace));
      return;
    }

    const space = await SpaceModel.findById(id);

    if (!space) {
      res.status(404).json({ error: "Espaço não encontrado" });
      return;
    }

    await redisConfig.setRedis(cacheKey, JSON.stringify(space), 300);

    res.status(200).json(space);
    return;
  } catch (error) {
    console.error("Erro ao buscar espaço:", error);
    res.status(500).json({ error: "Erro ao buscar espaço" });
    return;
  }
};



// Verificar como sera feito a busca por localizacao

// Buscar espaços com filtros
export const getSpacesWithFilters = async (req: Request, res: Response) => {
  try {
    const {
      space_type,
      min_price,
      location,
      max_price,
      min_area,
      max_area,
      min_people,
      amenities,
      space_rules,
      week_days,
      order_by
    } = req.query;

    // Cria uma chave única para o cache baseada nos filtros
    const cacheKey = `spaces_filtered_${JSON.stringify(req.query)}`;
    const cachedSpaces = await redisConfig.getRedis(cacheKey);
    
    if (cachedSpaces) {
      res.status(200).json(JSON.parse(cachedSpaces));
      return;
    }

    // Construir o objeto de filtro
    const filter: any = {};

    // Validação do tipo de espaço
    if (space_type) {
      if (typeof space_type !== 'string') {
        res.status(400).json({ error: "O tipo de espaço deve ser uma string" });
        return;
      }
      filter.space_type = space_type;
    }

    // Validação de preço
    if (min_price || max_price) {
      filter.price_per_hour = {};
      
      if (min_price) {
        const minPriceNum = Number(min_price);
        if (isNaN(minPriceNum) || minPriceNum < 0) {
          res.status(400).json({ error: "O preço mínimo deve ser um número positivo" });
          return;
        }
        filter.price_per_hour.$gte = minPriceNum;
      }
      
      if (max_price) {
        const maxPriceNum = Number(max_price);
        if (isNaN(maxPriceNum) || maxPriceNum < 0) {
          res.status(400).json({ error: "O preço máximo deve ser um número positivo" });
          return;
        }
        if (min_price && maxPriceNum < Number(min_price)) {
          res.status(400).json({ error: "O preço máximo deve ser maior que o preço mínimo" });
          return;
        }
        filter.price_per_hour.$lte = maxPriceNum;
      }
    }

    // Validação de localização
    if (location) {
      if (typeof location !== 'string') {
        res.status(400).json({ error: "A localização deve ser uma string" });
        return;
      }

      try {
        // Primeira tentativa: Usa o Google Maps API para validar e formatar o endereço
        const googleMapsService = new GoogleMapsService();
        const addressValidation = await googleMapsService.validateAddress({
          street: location,
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        });

        if (addressValidation.isValid && addressValidation.formattedAddress) {
          // Extrai componentes do endereço formatado
          const addressComponents = addressValidation.formattedAddress.split(',');
          const city = addressComponents[addressComponents.length - 2]?.trim() || '';
          const state = addressComponents[addressComponents.length - 1]?.trim() || '';

          // Cria uma expressão regular para busca flexível
          const searchRegex = new RegExp(location, 'i');

          // Busca espaços que contenham o endereço em qualquer parte do formatted_address
          filter['location.formatted_address'] = searchRegex;

          // Se tiver cidade e estado, adiciona como filtros adicionais
          if (city) {
            filter['location.formatted_address'] = {
              $regex: new RegExp(city, 'i')
            };
          }

          if (state) {
            filter['location.formatted_address'] = {
              $regex: new RegExp(state, 'i')
            };
          }
        } else {
          // Se a validação do Google Maps falhar, faz uma busca direta
          throw new Error('Falha na validação do Google Maps');
        }
      } catch (error) {
        // Segunda tentativa: Busca direta no banco de dados
        console.log('Usando busca direta no banco de dados para:', location);
        
        // Cria uma expressão regular para busca flexível
        const searchRegex = new RegExp(location, 'i');
        
        // Busca em todos os campos de localização
        filter.$or = [
          { 'location.formatted_address': searchRegex },
          { 'location.street': searchRegex },
          { 'location.city': searchRegex },
          { 'location.state': searchRegex },
          { 'location.neighborhood': searchRegex }
        ];
      }
    }

    // Validação de área
    if (min_area || max_area) {
      filter.area = {};
      
      if (min_area) {
        const minAreaNum = Number(min_area);
        if (isNaN(minAreaNum) || minAreaNum < 0) {
          res.status(400).json({ error: "A área mínima deve ser um número positivo" });
          return;
        }
        filter.area.$gte = minAreaNum;
      }
      
      if (max_area) {
        const maxAreaNum = Number(max_area);
        if (isNaN(maxAreaNum) || maxAreaNum < 0) {
          res.status(400).json({ error: "A área máxima deve ser um número positivo" });
          return;
        }
        if (min_area && maxAreaNum < Number(min_area)) {
          res.status(400).json({ error: "A área máxima deve ser maior que a área mínima" });
          return;
        }
        filter.area.$lte = maxAreaNum;
      }
    }

    // Validação de número de pessoas
    if (min_people) {
      const minPeopleNum = Number(min_people);
      if (isNaN(minPeopleNum) || minPeopleNum < 1) {
        res.status(400).json({ error: "O número mínimo de pessoas deve ser um número positivo maior que zero" });
        return;
      }
      filter.max_people = { $gte: minPeopleNum };
    }

    // Filtro por amenities
    if (amenities) {
      if (typeof amenities !== 'string') {
        res.status(400).json({ error: "As comodidades devem ser enviadas como uma string separada por vírgulas" });
        return;
      }

      // Converte a string de amenities em array, removendo espaços em branco
      const amenitiesArray = String(amenities).split(',').map(amenity => amenity.trim());
      
      // Verifica se há amenities duplicadas
      const uniqueAmenities = new Set(amenitiesArray);
      if (uniqueAmenities.size !== amenitiesArray.length) {
        res.status(400).json({ error: "Comodidades duplicadas não são permitidas" });
        return;
      }

      // Verifica se todas as amenities solicitadas são permitidas
      const invalidAmenities = amenitiesArray.filter(
        amenity => !ALLOWED_AMENITIES.includes(amenity)
      );

      if (invalidAmenities.length > 0) {
        res.status(400).json({
          error: "Comodidades inválidas encontradas",
          invalidAmenities
        });
        return;
      }

      // Adiciona o filtro para encontrar espaços que contenham TODAS as amenities solicitadas
      filter.space_amenities = { $all: amenitiesArray };
    }

    // Filtro por regras do espaço
    if (space_rules) {
      if (typeof space_rules !== 'string') {
        res.status(400).json({ error: "As regras devem ser enviadas como uma string separada por vírgulas" });
        return;
      }

      // Converte a string de regras em array, removendo espaços em branco
      const rulesArray = String(space_rules).split(',').map(rule => rule.trim());
      
      // Verifica se há regras duplicadas
      const uniqueRules = new Set(rulesArray);
      if (uniqueRules.size !== rulesArray.length) {
        res.status(400).json({ error: "Regras duplicadas não são permitidas" });
        return;
      }

      // Verifica se todas as regras solicitadas são permitidas
      const invalidRules = rulesArray.filter(
        rule => !ALLOWED_RULES.includes(rule)
      );

      if (invalidRules.length > 0) {
        res.status(400).json({
          error: "Regras inválidas encontradas",
          invalidRules
        });
        return;
      }

      // Adiciona o filtro para encontrar espaços que contenham TODAS as regras solicitadas
      filter.space_rules = { $all: rulesArray };
    }

    // Filtro por dias da semana
    if (week_days) {
      if (typeof week_days !== 'string') {
        res.status(400).json({ error: "Os dias da semana devem ser enviados como uma string separada por vírgulas" });
        return;
      }

      // Converte a string de dias em array, removendo espaços em branco
      const daysArray = String(week_days).split(',').map(day => day.trim());
      
      // Verifica se há dias duplicados
      const uniqueDays = new Set(daysArray);
      if (uniqueDays.size !== daysArray.length) {
        res.status(400).json({ error: "Dias duplicados não são permitidos" });
        return;
      }

      // Lista de dias válidos
      const validDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
      
      // Verifica se todos os dias solicitados são válidos
      const invalidDays = daysArray.filter(
        day => !validDays.includes(day.toLowerCase())
      );

      if (invalidDays.length > 0) {
        res.status(400).json({
          error: "Dias da semana inválidos encontrados",
          invalidDays
        });
        return;
      }

      // Adiciona o filtro para encontrar espaços que contenham TODOS os dias solicitados
      filter.week_days = { $all: daysArray.map(day => day.toLowerCase()) };
    }

    // Limita o número máximo de resultados para evitar sobrecarga
    let query = SpaceModel.find(filter).limit(100);

    // Aplica a ordenação se especificada
    if (order_by) {
      switch (order_by) {
        case 'asc':
          query = query.sort({ price_per_hour: 1 });
          break;
        case 'desc':
          query = query.sort({ price_per_hour: -1 });
          break;
        case 'recent':
          query = query.sort({ createdAt: -1 });
          break;
        default:
          // Ordenação padrão por relevância (pode ser ajustada conforme necessário)
          query = query.sort({ rating: -1 });
      }
    }

    const spaces = await query;

    if (!spaces || spaces.length === 0) {
      res.status(404).json({ error: "Nenhum espaço encontrado com os filtros especificados" });
      return;
    }

    await redisConfig.setRedis(cacheKey, JSON.stringify(spaces), 300);

    res.status(200).json(spaces);
    return;
  } catch (error) {
    console.error("Erro ao buscar espaços com filtros:", error);
    res.status(500).json({ error: "Erro interno ao buscar espaços" });
    return;
  }
};



// Criar um novo espaço
export const createSpace = async (req: Request, res: Response) => {
  try {
    // Para que somente locatários possam criar espaços
    if (req.auth?.role !== "locatario") {
      res.status(403).json({ error: "Apenas locatários podem criar espaços." });
      return;
    }

    // Verifica se o ID do usuário está disponível
    if (!req.auth?.id) {
      res.status(400).json({ error: "ID do usuário não encontrado na autenticação." });
      return;
    }

    const {
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      space_amenities,
      weekly_days,
      space_rules,
      price_per_hour,
      owner_name,
      document_number,
      document_photo,
      space_document_photo,
      owner_phone,
      owner_email,
      image_url,
    } = req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (
      !space_name ||
      !max_people ||
      !location ||
      !space_type ||
      !price_per_hour ||
      !space_amenities ||
      !weekly_days ||
      !owner_name ||
      !document_number ||
      !document_photo ||
      !space_document_photo ||
      !owner_phone ||
      !owner_email ||
      !image_url
    ) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
      return;
    }

    // Validação dos horários
    if (!Array.isArray(weekly_days)) {
      res.status(400).json({ error: "O formato dos horários está inválido." });
      return;
    }

    // Validação dos horários para cada dia
    for (const day of weekly_days) {
      if (!day.day || !Array.isArray(day.time_ranges)) {
        res.status(400).json({ error: "Formato inválido para os horários." });
        return;
      }

      // Validação do dia da semana
      const validDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
      if (!validDays.includes(day.day.toLowerCase())) {
        res.status(400).json({ error: `Dia da semana inválido: ${day.day}` });
        return;
      }

      // Validação dos horários específicos
      for (const range of day.time_ranges) {
        if (!range.open || !range.close) {
          res.status(400).json({ error: "Horários de abertura e fechamento são obrigatórios." });
          return;
        }

        // Validação do formato dos horários (HH:mm)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(range.open) || !timeRegex.test(range.close)) {
          res.status(400).json({ error: "Formato de horário inválido. Use HH:mm." });
          return;
        }
      }
    }

    // Extrai os dias da semana para o formato antigo (para compatibilidade)
    const week_days = weekly_days.map(day => day.day.toLowerCase());

    // Valida o endereço usando o Google Maps API
    const googleMapsService = new GoogleMapsService();
    const addressValidation = await googleMapsService.validateAddress({
      street: location.street,
      number: location.number,
      complement: location.complement,
      neighborhood: location.neighborhood,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode
    });

    if (!addressValidation.isValid) {
      res.status(400).json({
        error: "Endereço inválido",
        details: addressValidation.error
      });
      return;
    }

    // Verifica se todas as comodidades são permitidas
    const invalidAmenities = space_amenities.filter(
      (amenity: string) => !ALLOWED_AMENITIES.includes(amenity)
    );

    if (invalidAmenities.length > 0) {
      res.status(400).json({
        error: "Comodidades inválidas encontradas",
        invalidAmenities
      });
      return;
    }

    // Verifica se todas as regras são permitidas (apenas se foram fornecidas)
    if (space_rules && space_rules.length > 0) {
      const invalidRules = space_rules.filter(
        (rule: string) => !ALLOWED_RULES.includes(rule)
      );

      if (invalidRules.length > 0) {
        res.status(400).json({
          error: "Regras inválidas encontradas",
          invalidRules
        });
        return;
      }
    }

    // Cria um novo espaço
    const newSpace = new SpaceModel({
      owner_id: req.auth.id,
      space_name,
      max_people,
      location: {
        formatted_address: addressValidation.formattedAddress,
        place_id: addressValidation.placeId,
        coordinates: addressValidation.coordinates
      },
      space_type,
      space_description,
      space_amenities,
      weekly_days,
      week_days,
      space_rules,
      price_per_hour,
      owner_name,
      document_number,
      document_photo,
      space_document_photo,
      owner_phone,
      owner_email,
      image_url,
    });

    await newSpace.save();

    // Invalida todos os caches relacionados a espaços
    await Promise.all([
      redisConfig.deleteRedis('all_spaces'),
      redisConfig.deleteRedisPattern('spaces_filtered_*'),
      redisConfig.deleteRedisPattern('spaces_by_amenities_*'),
      redisConfig.deleteRedisPattern('spaces_by_owner_*')
    ]);

    res.status(201).json(newSpace);
    return;
  } catch (error) {
    console.error("Erro ao criar espaço:", error);

    // Verifica se o erro é de validação
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: "Erro de validação dos campos" });
      return;
    }

    res.status(500).json({ error: "Erro ao criar espaço" });
    return;
  }
};

// Atualizar um espaço por ID
export const updateSpace = async (req: Request, res: Response) => {
  try {
    // Para que somente locatários possam atualizar espaços
    if (req.auth?.role !== "locatario") {
      res.status(403).json({ error: "Apenas locatários podem atualizar espaços." });
      return;
    }

    // Verifica se o ID do usuário está disponível
    if (!req.auth?.id) {
      res.status(400).json({ error: "ID do usuário não encontrado na autenticação." });
      return;
    }

    const { id } = req.params;

    // Verifica se o espaço existe e pertence ao usuário
    const existingSpace = await SpaceModel.findById(id);
    if (!existingSpace) {
      res.status(404).json({ error: "Espaço não encontrado" });
      return;
    }

    // Verifica se o usuário é o proprietário do espaço
    if (existingSpace.owner_id.toString() !== req.auth.id) {
      res.status(403).json({ 
        error: "Você não tem permissão para atualizar este espaço. Apenas o proprietário pode modificá-lo." 
      });
      return;
    }

    const {
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      space_amenities,
      weekly_days,
      space_rules,
      price_per_hour,
      owner_name,
      document_number,
      document_photo,
      space_document_photo,
      owner_phone,
      owner_email,
      image_url,
    } = req.body;

    // Verifica se pelo menos um campo foi enviado para atualização
    const hasUpdates = Object.keys(req.body).length > 0;
    if (!hasUpdates) {
      res.status(400).json({ error: "É necessário enviar pelo menos um campo para atualização." });
      return;
    }

    // Prepara o objeto de atualização apenas com os campos enviados
    const updatedData: any = {};

    // Adiciona apenas os campos que foram enviados na requisição
    if (space_name) updatedData.space_name = space_name;
    if (max_people) updatedData.max_people = max_people;
    if (space_type) updatedData.space_type = space_type;
    if (space_description) updatedData.space_description = space_description;
    if (space_amenities) {
      // Valida as comodidades se foram enviadas
      const invalidAmenities = space_amenities.filter(
        (amenity: string) => !ALLOWED_AMENITIES.includes(amenity)
      );

      if (invalidAmenities.length > 0) {
        res.status(400).json({
          error: "Comodidades inválidas encontradas",
          invalidAmenities
        });
        return;
      }
      updatedData.space_amenities = space_amenities;
    }
    if (space_rules) {
      // Valida as regras se foram enviadas
      const invalidRules = space_rules.filter(
        (rule: string) => !ALLOWED_RULES.includes(rule)
      );

      if (invalidRules.length > 0) {
        res.status(400).json({
          error: "Regras inválidas encontradas",
          invalidRules
        });
        return;
      }
      updatedData.space_rules = space_rules;
    }
    if (price_per_hour) updatedData.price_per_hour = price_per_hour;
    if (owner_name) updatedData.owner_name = owner_name;
    if (document_number) updatedData.document_number = document_number;
    if (document_photo) updatedData.document_photo = document_photo;
    if (space_document_photo) updatedData.space_document_photo = space_document_photo;
    if (owner_phone) updatedData.owner_phone = owner_phone;
    if (owner_email) updatedData.owner_email = owner_email;
    if (image_url) updatedData.image_url = image_url;

    // Valida e atualiza os horários se foram enviados
    if (weekly_days) {
      if (!Array.isArray(weekly_days)) {
        res.status(400).json({ error: "O formato dos horários está inválido." });
        return;
      }

      // Validação dos horários para cada dia
      for (const day of weekly_days) {
        if (!day.day || !Array.isArray(day.time_ranges)) {
          res.status(400).json({ error: "Formato inválido para os horários." });
          return;
        }

        // Validação do dia da semana
        const validDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
        if (!validDays.includes(day.day.toLowerCase())) {
          res.status(400).json({ error: `Dia da semana inválido: ${day.day}` });
          return;
        }

        // Validação dos horários específicos
        for (const range of day.time_ranges) {
          if (!range.open || !range.close) {
            res.status(400).json({ error: "Horários de abertura e fechamento são obrigatórios." });
            return;
          }

          // Validação do formato dos horários (HH:mm)
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(range.open) || !timeRegex.test(range.close)) {
            res.status(400).json({ error: "Formato de horário inválido. Use HH:mm." });
            return;
          }
        }
      }

      updatedData.weekly_days = weekly_days;
      updatedData.week_days = weekly_days.map(day => day.day.toLowerCase());
    }

    // Valida e atualiza a localização se foi enviada
    if (location) {
      const googleMapsService = new GoogleMapsService();
      const addressValidation = await googleMapsService.validateAddress({
        street: location.street,
        number: location.number,
        complement: location.complement,
        neighborhood: location.neighborhood,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode
      });

      if (!addressValidation.isValid) {
        res.status(400).json({
          error: "Endereço inválido",
          details: addressValidation.error
        });
        return;
      }

      updatedData.location = {
        formatted_address: addressValidation.formattedAddress,
        place_id: addressValidation.placeId,
        coordinates: addressValidation.coordinates
      };
    }

    const updatedSpace = await SpaceModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    // Invalida todos os caches relacionados a espaços
    await Promise.all([
      redisConfig.deleteRedis('all_spaces'),
      redisConfig.deleteRedis(`space_${id}`),
      redisConfig.deleteRedisPattern('spaces_filtered_*'),
      redisConfig.deleteRedisPattern('spaces_by_amenities_*'),
      redisConfig.deleteRedisPattern('spaces_by_owner_*')
    ]);

    res.status(200).json(updatedSpace);
    return;
  } catch (error) {
    console.error("Erro ao atualizar espaço:", error);

    // Verifica se o erro é de validação do Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Erro ao atualizar espaço" });
    return;
  }
};

// Excluir um espaço por ID
export const deleteSpace = async (req: Request, res: Response) => {
  try {
    if (!req.auth || !["locatario", "admin"].includes(req.auth.role)) {
      res.status(403).json({
        error: "Apenas locatários ou administradores podem excluir espaços."
      });
      return;
    }

    const { id } = req.params;

    // Add validation for ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const deletedSpace = await SpaceModel.findByIdAndDelete(id);

    if (!deletedSpace) {
      res.status(404).json({ error: "Espaço não encontrado" });
      return;
    }

    // Invalida todos os caches relacionados a espaços
    await Promise.all([
      redisConfig.deleteRedis('all_spaces'),
      redisConfig.deleteRedis(`space_${id}`),
      redisConfig.deleteRedisPattern('spaces_filtered_*'),
      redisConfig.deleteRedisPattern('spaces_by_amenities_*'),
      redisConfig.deleteRedisPattern('spaces_by_owner_*')
    ]);

    res.status(200).json({
      message: "Espaço excluído com sucesso",
      deletedSpace
    });
    return;
  } catch (error) {
    console.error("Erro ao excluir espaço:", error);
    res.status(500).json({
      error: "Erro ao excluir espaço",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
};


// Buscar espaços por comodidades da tela de experiência
export const getSpacesByExperienceAmenities = async (req: Request, res: Response) => {
  try {
    // Tenta obter os dados do cache
    const cacheKey = 'spaces_by_amenities_experience';
    const cachedSpaces = await redisConfig.getRedis(cacheKey);
    
    if (cachedSpaces) {
      res.status(200).json(JSON.parse(cachedSpaces));
      return;
    }

    // Busca todos os espaços que tenham pelo menos uma das comodidades
    const spaces = await SpaceModel.find({
      space_amenities: {
        $in: ['estacionamento', 'wifi', 'piscina', 'churrasqueira', 'ar_condicionado', 'tv']
      }
    })
    .select('image_url space_name location space_amenities price_per_hour') // Adicionado price_per_hour
    .sort({ rating: -1 }); // Ordena por avaliação

    // Organiza os espaços por comodidade e pega apenas a primeira imagem
    const spacesByAmenity = {
      parking: spaces
        .filter(space => space.space_amenities.includes('estacionamento'))
        .map(space => ({
          ...space.toObject(),
          image_url: Array.isArray(space.image_url) ? space.image_url[0] : space.image_url,
          price_per_hour: space.price_per_hour
        }))
        .slice(0, 5),
      wifi: spaces
        .filter(space => space.space_amenities.includes('wifi'))
        .map(space => ({
          ...space.toObject(),
          image_url: Array.isArray(space.image_url) ? space.image_url[0] : space.image_url,
          price_per_hour: space.price_per_hour
        }))
        .slice(0, 5),
      pool: spaces
        .filter(space => space.space_amenities.includes('piscina'))
        .map(space => ({
          ...space.toObject(),
          image_url: Array.isArray(space.image_url) ? space.image_url[0] : space.image_url,
          price_per_hour: space.price_per_hour
        }))
        .slice(0, 5),
      barbecue: spaces
        .filter(space => space.space_amenities.includes('churrasqueira'))
        .map(space => ({
          ...space.toObject(),
          image_url: Array.isArray(space.image_url) ? space.image_url[0] : space.image_url,
          price_per_hour: space.price_per_hour
        }))
        .slice(0, 5),
      ac: spaces
        .filter(space => space.space_amenities.includes('ar_condicionado'))
        .map(space => ({
          ...space.toObject(),
          image_url: Array.isArray(space.image_url) ? space.image_url[0] : space.image_url,
          price_per_hour: space.price_per_hour
        }))
        .slice(0, 5),
      tv: spaces
        .filter(space => space.space_amenities.includes('tv'))
        .map(space => ({
          ...space.toObject(),
          image_url: Array.isArray(space.image_url) ? space.image_url[0] : space.image_url,
          price_per_hour: space.price_per_hour
        }))
        .slice(0, 5)
    };

    await redisConfig.setRedis(cacheKey, JSON.stringify(spacesByAmenity), 300);

    res.status(200).json(spacesByAmenity);
    return;
  } catch (error) {
    console.error("Erro ao buscar espaços por comodidades:", error);
    res.status(500).json({
      error: "Erro ao buscar espaços por comodidades",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
};

// Buscar espaços por ID do proprietário
export const getSpacesByOwnerId = async (req: Request, res: Response) => {
  try {
    const { owner_id } = req.params;

    // Tenta obter os dados do cache
    const cacheKey = `spaces_by_owner_${owner_id}`;
    const cachedSpaces = await redisConfig.getRedis(cacheKey);
    
    if (cachedSpaces) {
      res.status(200).json(JSON.parse(cachedSpaces));
      return;
    }

    // Validação do ID
    if (!mongoose.Types.ObjectId.isValid(owner_id)) {
      res.status(400).json({ error: "ID do proprietário inválido" });
      return;
    }

    const spaces = await SpaceModel.find({ owner_id });

    if (!spaces || spaces.length === 0) {
      res.status(404).json({ error: "Nenhum espaço encontrado para este proprietário" });
      return;
    }

    await redisConfig.setRedis(cacheKey, JSON.stringify(spaces), 300);

    res.status(200).json(spaces);
    return;
  } catch (error) {
    console.error("Erro ao buscar espaços do proprietário:", error);
    res.status(500).json({ 
      error: "Erro ao buscar espaços do proprietário",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
};
