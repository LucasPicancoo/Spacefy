import api from "./api"

export const assessmentService = {

    async createAssessment(assessmentData) {
        const response = await api.post(`/assessment/create`, assessmentData);
        return response.data;        
    },

    async updateAssessment(assessmentId, assessmentData) {
        const data = {
            rating: assessmentData.score,
            userId: assessmentData.userID,
            spaceId: assessmentData.spaceID
        };
        const response = await api.put(`/assessment/${assessmentId}`, data);
        return response.data;
    },

    async deleteAssessment(assessmentId) {
        const response = await api.delete(`/assessment/delete/${assessmentId}`);
        return response.data;
    },

    async getAssessmentsBySpace(spaceId) {
        const response = await api.get(`/assessment/space/${spaceId}`);
        return response.data;
    },

    async topRatedSpaces() {
        const response = await api.get(`/assessment/top-rated`);
        return response.data;
    },

    async getAssessmentsByUser(userId, page = 1) {
        const response = await api.get(`/assessment/user/${userId}?page=${page}`);
        return response.data;
    }

};
