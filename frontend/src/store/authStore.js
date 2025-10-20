import { create } from 'zustand'

const useAuthStore = create((set, get) => {
  // Load initial state from localStorage
  const storedAuth = localStorage.getItem('auth-storage')
  const initialState = storedAuth ? JSON.parse(storedAuth) : {
    user: null,
    token: null,
    isAuthenticated: false,
  }

  return {
    ...initialState,
    
    setAuth: (user, token) => {
      const newState = { user, token, isAuthenticated: true }
      set(newState)
      localStorage.setItem('auth-storage', JSON.stringify(newState))
    },
    
    logout: () => {
      const newState = { user: null, token: null, isAuthenticated: false }
      set(newState)
      localStorage.removeItem('auth-storage')
    },
    
    updateUser: (userData) => {
      set((state) => {
        const newState = {
          ...state,
          user: { ...state.user, ...userData }
        }
        localStorage.setItem('auth-storage', JSON.stringify(newState))
        return newState
      })
    },
    
    getToken: () => get().token,
  }
})

export default useAuthStore