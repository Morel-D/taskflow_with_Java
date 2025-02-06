import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if(token){
            token = JSON.parse(localStorage.getItem('token'));
            config.headers['Authorization']  = `Bearer ${token}`;
        }
        console.log('Request Headers:', config.headers);

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;