import api from './api';

export const userService = {

    // Toggle favorito do espaço (adiciona/remove)
    async toggleFavoriteSpace(userId, spaceId) {
        const response = await api.post(`/users/${userId}/favorite`, { spaceId });
        return response.data; // Retorna o objeto completo com isFavorited
    },

    // Buscar todos os espaços favoritados do usuário
    async getFavoriteSpaces(userId) {
        const response = await api.get(`/users/${userId}/favorites`);
        return response.data; // Retorna a lista de espaços favoritados
    },

    // Registrar uma visualização de espaço
    async registerSpaceView(userId, spaceId) {
        const response = await api.post('/view-history/view', {
            user_id: userId,
            space_id: spaceId
        });
        return response.data;
    },

    // Buscar histórico de visualizações do usuário
    async getViewHistory(userId) {
        const response = await api.get(`/view-history/user/${userId}`);
        return response.data;
    },

};
