import api from './api';

export const spaceService = {
    // Buscar todos os espaços
    async getSpaces() {
        const response = await api.get('/spaces/getAllSpaces');
        return response.data;
    },

    // Buscar espaço pelo ID
    async getSpaceById(id) {
        const response = await api.get(`/spaces/getSpaceById/${id}`);
        return response.data;
    },

    // Criar novo espaço
    async createSpace(spaceData) {
        const response = await api.post('/spaces/createSpace', spaceData);
        return response.data;
    },

    // Atualizar espaço existente
    async updateSpace(id, updatedData) {
        const response = await api.put(`/spaces/updateSpace/${id}`, updatedData);
        return response.data;
    },

    // Deletar espaço
    async deleteSpace(id) {
        const response = await api.delete(`/spaces/deleteSpace/${id}`);
        return response.data;
    },

    // Buscar espaços com filtros
    async getSpacesWithFilters(params) {
        const response = await api.get(`/spaces/getSpacesWithFilters?${params}`);
        return response.data;
    },

    async getSpacesByExperienceAmenities() {
        const response = await api.get('/spaces/getSpacesByExperienceAmenities');
        return response.data;
    },

    // Buscar espaços por ID do proprietário
    async getSpacesByOwnerId(ownerId) {
        const response = await api.get(`/spaces/getSpacesByOwnerId/${ownerId}`);
        return response.data;
    }
};
