import axios from 'axios';

// Base URL for Spring Boot backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor — automatically adds JWT token to every request
// (same concept as Spring Security filter, but on the client side)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('nexline_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Auth APIs ───────────────────────────────────────────
export const login = (phone, password) =>
    api.post('/api/auth/login', { phone, password });

export const register = (name, phone, password, role) =>
    api.post('/api/auth/register', { name, phone, password, role });

// ─── Customer APIs ───────────────────────────────────────
export const getServiceTypes = () =>
    api.get('/api/service-types');

export const createToken = (customerName, customerPhone, serviceTypeId) =>
    api.post('/api/tokens', { customerName, customerPhone, serviceTypeId });

export const getQueueStatus = (serviceTypePrefix, tokenId) =>
    api.get(`/api/queue/status/${serviceTypePrefix}/${tokenId}`);

// ─── Admin APIs ──────────────────────────────────────────
export const getCounters = () =>
    api.get('/api/admin/counters');

export const callNextToken = (counterId) =>
    api.post(`/api/queue/next/${counterId}`);

export const completeToken = (tokenId) =>
    api.put(`/api/queue/tokens/${tokenId}/complete`);

export const skipToken = (tokenId) =>
    api.put(`/api/queue/tokens/${tokenId}/skip`);

export default api;