import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
};

// Jobs API
export const jobs = {
  getAll: (params) => api.get('/jobs', { params }),
  getRecent: (limit = 20) => api.get('/jobs/recent', { params: { limit } }),
  getStats: () => api.get('/jobs/stats'),
  delete: (id) => api.delete(`/jobs/${id}`),
  deleteAll: () => api.delete('/jobs'),
};

// Sources API
export const sources = {
  getAll: () => api.get('/sources'),
  getOne: (id) => api.get(`/sources/${id}`),
  create: (data) => api.post('/sources', data),
  update: (id, data) => api.put(`/sources/${id}`, data),
  toggle: (id) => api.patch(`/sources/${id}/toggle`),
  delete: (id) => api.delete(`/sources/${id}`),
};

// Scraper API
export const scraper = {
  startScrape: () => api.post('/scraper/scrape'),
  getStatus: () => api.get('/scraper/status'),
  retryPosts: () => api.post('/scraper/retry-posts'),
  testTelegram: () => api.get('/scraper/test-telegram'),
};

export default api;
