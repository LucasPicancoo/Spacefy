import { Request, Response } from "express";
import SpaceModel from "../models/spaceModel";
import { AMENITIES, ALLOWED_AMENITIES } from "../constants/amenities";
import { ALLOWED_RULES } from "../constants/spaceRules";
import mongoose from 'mongoose';
import { GoogleMapsService } from "../services/googleMapsService";

// import { AuthenticationData } from "../types/auth";

// Listar todos os espaços
export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await SpaceModel.find();

    if (!spaces) {
      res.status(404).json({ error: "Nenhum espaço encontrado" });
    }

    res.status(200).json(spaces);
  } catch (error) {
    console.error("Erro ao listar espaços:", error);
    res.status(500).json({ error: "Erro ao listar espaços" });
  }
};

// Obter um espaço por ID
export const getSpaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const space = await SpaceModel.findById(id);

    if (!space) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    return res.status(200).json(space);
  } catch (error) {
    console.error("Erro ao buscar espaço:", error);
    return res.status(500).json({ error: "Erro ao buscar espaço" });
  }
};



// Verificar como sera feito a busca por localizacao

// Buscar espaços com filtros
export const getSpacesWithFilters = async (req: Request, res: Response) => {
  try {
    const {
      space_type,
      min_price,
      max_price,
      min_area,
      max_area,
      min_people,
      amenities,
      space_rules,
      week_days,
      order_by
    } = req.query;

    // Construir o objeto de filtro
    const filter: any = {};

    // Validação do tipo de espaço
    if (space_type) {
      if (typeof space_type !== 'string') {
        return res.status(400).json({ error: "O tipo de espaço deve ser uma string" });
      }
      filter.space_type = space_type;
    }

    // Validação de preço
    if (min_price || max_price) {
      filter.price_per_hour = {};
      
      if (min_price) {
        const minPriceNum = Number(min_price);
        if (isNaN(minPriceNum) || minPriceNum < 0) {
          return res.status(400).json({ error: "O preço mínimo deve ser um número positivo" });
        }
        filter.price_per_hour.$gte = minPriceNum;
      }
      
      if (max_price) {
        const maxPriceNum = Number(max_price);
        if (isNaN(maxPriceNum) || maxPriceNum < 0) {
          return res.status(400).json({ error: "O preço máximo deve ser um número positivo" });
        }
        if (min_price && maxPriceNum < Number(min_price)) {
          return res.status(400).json({ error: "O preço máximo deve ser maior que o preço mínimo" });
        }
        filter.price_per_hour.$lte = maxPriceNum;
      }
    }

    // Validação de área
    if (min_area || max_area) {
      filter.area = {};
      
      if (min_area) {
        const minAreaNum = Number(min_area);
        if (isNaN(minAreaNum) || minAreaNum < 0) {
          return res.status(400).json({ error: "A área mínima deve ser um número positivo" });
        }
        filter.area.$gte = minAreaNum;
      }
      
      if (max_area) {
        const maxAreaNum = Number(max_area);
        if (isNaN(maxAreaNum) || maxAreaNum < 0) {
          return res.status(400).json({ error: "A área máxima deve ser um número positivo" });
        }
        if (min_area && maxAreaNum < Number(min_area)) {
          return res.status(400).json({ error: "A área máxima deve ser maior que a área mínima" });
        }
        filter.area.$lte = maxAreaNum;
      }
    }

    // Validação de número de pessoas
    if (min_people) {
      const minPeopleNum = Number(min_people);
      if (isNaN(minPeopleNum) || minPeopleNum < 1) {
        return res.status(400).json({ error: "O número mínimo de pessoas deve ser um número positivo maior que zero" });
      }
      filter.max_people = { $gte: minPeopleNum };
    }

    // Filtro por amenities
    if (amenities) {
      if (typeof amenities !== 'string') {
        return res.status(400).json({ error: "As comodidades devem ser enviadas como uma string separada por vírgulas" });
      }

      // Converte a string de amenities em array, removendo espaços em branco
      const amenitiesArray = String(amenities).split(',').map(amenity => amenity.trim());
      
      // Verifica se há amenities duplicadas
      const uniqueAmenities = new Set(amenitiesArray);
      if (uniqueAmenities.size !== amenitiesArray.length) {
        return res.status(400).json({ error: "Comodidades duplicadas não são permitidas" });
      }

      // Verifica se todas as amenities solicitadas são permitidas
      const invalidAmenities = amenitiesArray.filter(
        amenity => !ALLOWED_AMENITIES.includes(amenity)
      );

      if (invalidAmenities.length > 0) {
        return res.status(400).json({
          error: "Comodidades inválidas encontradas",
          invalidAmenities
        });
      }

      // Adiciona o filtro para encontrar espaços que contenham TODAS as amenities solicitadas
      filter.space_amenities = { $all: amenitiesArray };
    }

    // Filtro por regras do espaço
    if (space_rules) {
      if (typeof space_rules !== 'string') {
        return res.status(400).json({ error: "As regras devem ser enviadas como uma string separada por vírgulas" });
      }

      // Converte a string de regras em array, removendo espaços em branco
      const rulesArray = String(space_rules).split(',').map(rule => rule.trim());
      
      // Verifica se há regras duplicadas
      const uniqueRules = new Set(rulesArray);
      if (uniqueRules.size !== rulesArray.length) {
        return res.status(400).json({ error: "Regras duplicadas não são permitidas" });
      }

      // Verifica se todas as regras solicitadas são permitidas
      const invalidRules = rulesArray.filter(
        rule => !ALLOWED_RULES.includes(rule)
      );

      if (invalidRules.length > 0) {
        return res.status(400).json({
          error: "Regras inválidas encontradas",
          invalidRules
        });
      }

      // Adiciona o filtro para encontrar espaços que contenham TODAS as regras solicitadas
      filter.space_rules = { $all: rulesArray };
    }

    // Filtro por dias da semana
    if (week_days) {
      if (typeof week_days !== 'string') {
        return res.status(400).json({ error: "Os dias da semana devem ser enviados como uma string separada por vírgulas" });
      }

      // Converte a string de dias em array, removendo espaços em branco
      const daysArray = String(week_days).split(',').map(day => day.trim());
      
      // Verifica se há dias duplicados
      const uniqueDays = new Set(daysArray);
      if (uniqueDays.size !== daysArray.length) {
        return res.status(400).json({ error: "Dias duplicados não são permitidos" });
      }

      // Lista de dias válidos
      const validDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
      
      // Verifica se todos os dias solicitados são válidos
      const invalidDays = daysArray.filter(
        day => !validDays.includes(day.toLowerCase())
      );

      if (invalidDays.length > 0) {
        return res.status(400).json({
          error: "Dias da semana inválidos encontrados",
          invalidDays
        });
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
      return res.status(404).json({ error: "Nenhum espaço encontrado com os filtros especificados" });
    }

    return res.status(200).json(spaces);
  } catch (error) {
    console.error("Erro ao buscar espaços com filtros:", error);
    return res.status(500).json({ error: "Erro ao buscar espaços com filtros" });
  }
};



// Criar um novo espaço
export const createSpace = async (req: Request, res: Response) => {
  try {
    // Para que somente locatários possam criar espaços
    if (req.auth?.role !== "locatario") {
      return res
        .status(403)
        .json({ error: "Apenas locatários podem criar espaços." });
    }

    // Verifica se o ID do usuário está disponível
    if (!req.auth?.id) {
      return res
        .status(400)
        .json({ error: "ID do usuário não encontrado na autenticação." });
    }

    const {
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      space_amenities,
      week_days,
      opening_time,
      closing_time,
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
      !week_days ||
      !opening_time ||
      !closing_time ||
      !owner_name ||
      !document_number ||
      !document_photo ||
      !space_document_photo ||
      !owner_phone ||
      !owner_email ||
      !image_url
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

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
      return res.status(400).json({
        error: "Endereço inválido",
        details: addressValidation.error
      });
    }

    // Verifica se todas as comodidades são permitidas
    const invalidAmenities = space_amenities.filter(
      (amenity: string) => !ALLOWED_AMENITIES.includes(amenity)
    );

    if (invalidAmenities.length > 0) {
      return res.status(400).json({
        error: "Comodidades inválidas encontradas",
        invalidAmenities
      });
    }

    // Verifica se todas as regras são permitidas (apenas se foram fornecidas)
    if (space_rules && space_rules.length > 0) {
      const invalidRules = space_rules.filter(
        (rule: string) => !ALLOWED_RULES.includes(rule)
      );

      if (invalidRules.length > 0) {
        return res.status(400).json({
          error: "Regras inválidas encontradas",
          invalidRules
        });
      }
    }

    // Cria um novo espaço
    const newSpace = new SpaceModel({
      owner_id: req.auth.id, // Adiciona o ID do usuário autenticado
      space_name,
      max_people,
      location: {
        formatted_address: addressValidation.formattedAddress,
        place_id: addressValidation.placeId
      },
      space_type,
      space_description,
      space_amenities,
      week_days,
      opening_time,
      closing_time,
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
    res.status(201).json(newSpace);
  } catch (error) {
    console.error("Erro ao criar espaço:", error);

    // Verifica se o erro é de validação
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({ error: "Erro de validação dos campos" });
    }

    return res.status(500).json({ error: "Erro ao criar espaço" });
  }
};

// Atualizar um espaço por ID
export const updateSpace = async (req: Request, res: Response) => {
  try {
    // Para que somente locatários possam atualizar espaços
    if (req.auth?.role !== "locatario") {
      return res
        .status(403)
        .json({ error: "Apenas locatários podem atualizar espaços." });
    }

    const {
      space_name,
      max_people,
      location,
      space_type,
      price_per_hour,
      owner_name,
      document_number,
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
      !owner_name ||
      !document_number ||
      !owner_phone ||
      !owner_email ||
      !image_url
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    const { id } = req.params;
    const updatedSpace = await SpaceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedSpace) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    return res.status(200).json(updatedSpace);
  } catch (error) {
    console.error("Erro ao atualizar espaço:", error);

    // Verifica se o erro é de validação do Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao atualizar espaço" });
  }
};

// Excluir um espaço por ID
export const deleteSpace = async (req: Request, res: Response) => {
  try {
    if (!req.auth || !["locatario", "admin"].includes(req.auth.role)) {
      return res.status(403).json({
        error: "Apenas locatários ou administradores podem excluir espaços."
      });
    }

    const { id } = req.params;

    // Add validation for ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deletedSpace = await SpaceModel.findByIdAndDelete(id);

    if (!deletedSpace) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    return res.status(200).json({
      message: "Espaço excluído com sucesso",
      deletedSpace
    });
  } catch (error) {
    console.error("Erro ao excluir espaço:", error);
    return res.status(500).json({
      error: "Erro ao excluir espaço",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}


// Buscar espaços por comodidades da tela de experiência
export const getSpacesByExperienceAmenities = async (req: Request, res: Response) => {
  try {
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

    return res.status(200).json(spacesByAmenity);
  } catch (error) {
    console.error("Erro ao buscar espaços por comodidades:", error);
    return res.status(500).json({
      error: "Erro ao buscar espaços por comodidades",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

// Buscar espaços por ID do proprietário
export const getSpacesByOwnerId = async (req: Request, res: Response) => {
  try {
    const { owner_id } = req.params;

    // Validação do ID
    if (!mongoose.Types.ObjectId.isValid(owner_id)) {
      return res.status(400).json({ error: "ID do proprietário inválido" });
    }

    const spaces = await SpaceModel.find({ owner_id });

    if (!spaces || spaces.length === 0) {
      return res.status(404).json({ error: "Nenhum espaço encontrado para este proprietário" });
    }

    return res.status(200).json(spaces);
  } catch (error) {
    console.error("Erro ao buscar espaços do proprietário:", error);
    return res.status(500).json({ 
      error: "Erro ao buscar espaços do proprietário",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};
