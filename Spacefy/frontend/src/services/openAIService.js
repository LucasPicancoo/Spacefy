import api from "./api";

export const openAIService = {
    async processUserPrompt(prompt) {
        const response = await api.post("/openai/processar-pesquisa", { prompt });
        return response.data;
    }
}