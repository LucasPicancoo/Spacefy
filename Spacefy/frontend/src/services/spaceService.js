import api from './api';

export const spaceService = {
    async createSpace(spaceData) {
        const response = await api.post('/spaces/createSpace', spaceData);
        return response.data;
    },

    async getSpaces() {
        const response = await api.get('/spaces');
        return response.data;
    },

    async getSpaceById(id) {
        const response = await api.get(`/spaces/${id}`);
        return response.data;
    },

    async searchSpaces(query) {
        const response = await api.get('/spaces/search', { params: query });
        return response.data;
    }
}; 