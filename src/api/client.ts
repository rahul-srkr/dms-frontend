import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('dms_token');

    if (token) {
        config.headers.token = token;
    }

    return config;
});

// Handle unauthorized requests
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('dms_token');
            sessionStorage.removeItem('dms_mobile');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);
