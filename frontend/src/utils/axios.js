import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        console.log(accessToken);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)) {
            alert("expired")
        }
        return Promise.reject(error);
    }
);

export default api;
