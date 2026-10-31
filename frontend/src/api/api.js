
import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT automatically to every API request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("wealthwise_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
