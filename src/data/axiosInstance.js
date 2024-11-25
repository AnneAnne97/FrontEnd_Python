import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Base URL of the Django API
});

export const fetchData = async () => {
    try {
        const response = await apiClient.get('/get_high_freq_data'); // Full endpoint
        console.log(response)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};