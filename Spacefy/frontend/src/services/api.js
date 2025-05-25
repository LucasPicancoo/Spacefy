import axios from "axios";
import Cookies from "js-cookie"; // Biblioteca para manipular cookies

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Recupera o token do cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
