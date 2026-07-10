import axios from 'axios';

// 1. Create instance for Node.js Backend (Port 5000)
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Request Interceptor to dynamically append JWT to Node.js backend requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Create instance for Python FastAPI AI Service (Port 8000)
const AI_API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// --- Node.js Backend API Endpoints ---
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const signupUser = (userData) => API.post('/auth/signup', userData);
export const createFIR = (firData) => API.post('/fir/create', firData);
export const getMyFIRs = () => API.get('/fir/my-firs'); 

// --- Python AI Service API Endpoints ---
export const getAiAnalysis = () => AI_API.get('/ai/analytics');

export default API;