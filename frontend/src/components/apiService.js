import axios from 'axios';
import { getAuth } from "firebase/auth";

// Set up the base URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:3000';

console.log(API_BASE_URL);

// Create a function to get the user's access token
const getAccessToken = async () => {
    try {
        const user = getAuth().currentUser;
        if (user) {
            const idTokenResult = await user.getIdTokenResult();
            return idTokenResult.token;
        } else {
            // Handle the case where there is no authenticated user
            throw new Error("User is not authenticated.");
        }
    } catch (error) {
        // Handle error here (e.g., logging, user notifications)
        throw error;
    }
};

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add an interceptor to set the Authorization header with the bearer token
api.interceptors.request.use(async (config) => {
    try {
        const accessToken = await getAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    } catch (error) {
        // Handle error here (e.g., logging, user notifications)
        throw error;
    }
});

// Generic GET request function
export const get = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        // Handle error here (e.g., logging, user notifications)
        throw error;
    }
};

// Generic POST request function
export const post = async (url, data) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Generic PUT request function
export const put = async (url, data) => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Generic DELETE request function
export const del = async (url) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};
