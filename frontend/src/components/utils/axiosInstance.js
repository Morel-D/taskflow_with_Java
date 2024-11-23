import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request interceptors : ', config);

        return config;
    }
);

export default axiosInstance;