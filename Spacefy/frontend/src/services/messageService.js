import api from './api';

export const messageService = {
    async getConversations(userId) {
        const response = await api.get(`/chat/conversations/${userId}`);
        return response.data;
    }
};
