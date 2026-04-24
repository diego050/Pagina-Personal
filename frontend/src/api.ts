import axios from 'axios';
import { CONFIG } from './config';

const api = axios.create({
    baseURL: CONFIG.BACKEND_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Content API
export const getContent = async (category?: string) => {
    const params = category ? { category } : {};
    return api.get('/content', { params });
};

export const updateContent = async (key: string, value: string) => {
    return api.put(`/content/${key}`, { value });
};

// Media API
export const getMedia = async (path: string = "") => {
    return api.get('/media', { params: { path } });
};

export const createMediaFolder = async (path: string, name: string) => {
    return api.post('/media/folder', { path, name });
};

export const renameMedia = async (oldPath: string, newPath: string) => {
    const response = await api.put('/media/rename', { old_path: oldPath, new_path: newPath });
    return response.data;
};

export const updateMediaMeta = async (filepath: string, altText: string, titleTag: string) => {
    const response = await api.put('/media/meta', { filepath, alt_text: altText, title_tag: titleTag });
    return response.data;
};

export const deleteMedia = async (path: string) => {
    return api.delete('/media', { params: { path } });
};

export const uploadMedia = async (file: File, path: string = "") => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const subscribe = async (name: string, email: string, honeypot?: string) => {
    return api.post('/subscribe', { name, email, honeypot });
};

export default api;
