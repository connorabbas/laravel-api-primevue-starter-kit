import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true,
    withXSRFToken: true,
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axiosInstance;
