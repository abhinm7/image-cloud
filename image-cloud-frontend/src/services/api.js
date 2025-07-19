import axios from 'axios';
import { getToken } from '../utils/auth';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const registerUser = (credentials) => apiClient.post('/auth/register', credentials);

export const createFolder = (folderData) => apiClient.post('/folders', folderData);
export const getRootFolders = () => apiClient.get('/folders');
export const getFolderContents = (folderId) => apiClient.get(`/folders/${folderId}`);

export const uploadImage = (formData) => {
    return apiClient.post('/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const searchImages = (query) => apiClient.get(`/images/search?q=${query}`);

export default apiClient;
