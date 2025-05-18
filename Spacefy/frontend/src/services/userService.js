import api from './api';

export const userService = {

    // Toggle favorito do espaço (adiciona/remove)
    async toggleFavoriteSpace(userId, spaceId) {
        const response = await api.post(`/users/${userId}/favorite`, { spaceId });
        return response.data; // Retorna um booleano indicando se o espaço está favoritado
    },

    // Buscar todos os espaços favoritados do usuário
    async getFavoriteSpaces(userId) {
        const response = await api.get(`/users/${userId}/favorites`);
        return response.data; // Retorna a lista de espaços favoritados
    },

};
