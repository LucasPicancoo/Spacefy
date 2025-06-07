import api from './api';

export const blockedDatesService = {
    getBlockedDatesBySpaceId: async (spaceId) => {
        try {
            const response = await api.get(`/blocked-dates/getBySpaceId/${spaceId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createOrUpdateBlockedDates: async (spaceId, blockedDates) => {
        try {
            const response = await api.post('/blocked-dates/createOrUpdate', {
                space_id: spaceId,
                blocked_dates: blockedDates
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 