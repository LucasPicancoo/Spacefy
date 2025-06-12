import api from './api';

export const userService = {

    // Toggle favorito do espaço (adiciona/remove)
    async toggleFavoriteSpace(userId, spaceId) {
        const response = await api.post(`/users/${userId}/favorite`, { spaceId });
        return response.data; // Retorna o objeto completo com isFavorited
    },

    // Buscar todos os espaços favoritados do usuário
    async getFavoriteSpaces(userId) {
        const response = await api.get(`/users/favorites/${userId}`);
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

    // Atualizar usuário para locatário
    async updateToLocatario(userId, cpfOrCnpj) {
        const response = await api.put(`/users/updateToLocatario/${userId}`, { cpfOrCnpj });
        return response.data;
    },

    // Atualizar dados do usuário
    async updateUser(userId, userData) {
        const response = await api.put(`/users/updateUser/${userId}`, userData);
        return response.data;
    },

    // Buscar usuário por ID
    async getUserById(userId) {
        const response = await api.get(`/users/getUserById/${userId}`);
        return response.data;
    }

};
