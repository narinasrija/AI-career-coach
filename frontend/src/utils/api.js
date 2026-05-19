import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// AI API
export const aiAPI = {
  analyzeResume: (formData) =>
    api.post('/ai/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  generateRoadmap: (data) => api.post('/ai/roadmap', data),
  mockInterview: (data) => api.post('/ai/interview', data),
};

export default api;
