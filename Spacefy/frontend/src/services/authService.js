import api from "./api";

export const authService = {
  async login(email, password) {
    // Faz a requisição de login
    const response = await api.post("/auth/login", { email, password });

    // Retorna os dados do usuário (o token já está armazenado no cookie pelo backend)
    return response.data;
  },

  async register(userData) {
    // Faz a requisição de registro
    const response = await api.post("/users/createUser", userData);
    return response.data;
  },
};
