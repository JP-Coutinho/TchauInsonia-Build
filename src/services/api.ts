import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { LoginRequest, LoginResponse, Course, CreateLessonRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (credentials: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/api/Auth/login', credentials),
};

// Course API
export const courseApi = {
  getAllCourses: (): Promise<AxiosResponse<Course[]>> =>
    api.get('/api/Course'),
  
  getCourseById: (courseId: string): Promise<AxiosResponse<any>> =>
    api.get(`/api/Course/${courseId}`),
  
  createLesson: (courseId: string, lesson: CreateLessonRequest): Promise<AxiosResponse<any>> =>
    api.post(`/api/Course/${courseId}/lessons`, lesson),
};

// Form API
export const formApi = {
  createForm: (form: any): Promise<AxiosResponse<any>> =>
    api.post('/api/Form', form),
};

export default api;