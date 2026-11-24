import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signin = (formData) => {
  return api.post('/login', formData);
};

export const signup = (formData) => {
  return api.post('/signup', formData);
};

export const getInterviews = () => api.get('/interviews');
export const createInterview = (interview) => api.post('/interviews', interview);
export const getInterview = (id) => api.get(`/interviews/${id}`);
export const updateInterview = (id, changes) => api.patch(`/interviews/${id}`, changes);
export const cancelInterview = (id) => api.post(`/interviews/${id}/cancel`);