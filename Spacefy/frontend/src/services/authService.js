import api from './api';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/users/createUser', userData);
        return response.data;
    }
}; 