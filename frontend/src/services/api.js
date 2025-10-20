import axios from 'axios'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance with proper timeout settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      toast.error('Session expired. Please login again.')
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  getProfile: () => api.get('/auth/profile'),
}

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
}

// Chapters API
export const chaptersAPI = {
  getAll: () => api.get('/chapters'),
  getById: (id) => api.get(`/chapters/${id}`),
}

// Lessons API
export const lessonsAPI = {
  getById: (id) => api.get(`/lessons/${id}`),
}

// Quests API
export const questsAPI = {
  getAll: () => api.get('/quests'),
  submitAnswer: (id, data) => api.post(`/quests/${id}/submit`, data),
}

// Flashcards API
export const flashcardsAPI = {
  getReview: () => api.get('/flashcards/review'),
  submitReview: (id, data) => api.post(`/flashcards/${id}/review`, data),
}

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
}

// Achievements API
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
}

// Leaderboard API
export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
}

// Review API
export const reviewAPI = {
  start: () => api.post('/review/start'),
  submit: (data) => api.post('/review/submit', data),
}

export default api