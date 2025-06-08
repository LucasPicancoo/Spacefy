import api from "./api";

export const openAIService = {
    async processUserPrompt(prompt) {
        const response = await api.post("/chat/processar-pesquisa", { prompt });
        return response.data;
    }
}