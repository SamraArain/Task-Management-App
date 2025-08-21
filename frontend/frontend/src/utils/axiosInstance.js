import axios from "axios";
import { BASE_URL } from "./apiPaths";

const BASE_URL = "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_API_URL || BASE_URL ,
});

// Function to check if token is expired
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        if (!payload.exp) return false; // No expiry means can't check
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return payload.exp < currentTime;
    } catch (error) {
        console.error("Invalid token format", error);
        return true; // Treat as expired if it can't be parsed
    }
};

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

//Response Interceptor 
axiosInstance.interceptors.response.use(
    (response) => {

        console.log("Api Response:", {
            status: response.status,
            data: response.data,
        });
        
        return response;
    },
    (error) => {
        //Handle common errors globally 
        if (error.response) {
            if(error.response.status === 401) {
                //Redirect to login page
                window.location.href = "/login";
            } else if  (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            } 
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;