// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// export default api;

import axios, { AxiosInstance } from "axios";
import config from "@/config/index";

const api: AxiosInstance = axios.create({
    baseURL: config.apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        if (response.data.code === "403" && window.location.pathname !== "/signin") {
            localStorage.clear();
            window.location.href = "/signin";
        }
        return response.data;
    },
    (error) => {
        console.log("error : ", error);
        return {
            code: "500",
            data: [],
            message: "Server Error",
        };
    }
);

export default api;
