import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import useGameStore from './store/gameStore'

// Layout components
import Layout from './components/Layout/Layout'
import AuthLayout from './components/Layout/AuthLayout'

// Auth pages
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'

// Main pages
import Dashboard from './pages/Dashboard/Dashboard'
import Chapters from './pages/Chapters/Chapters'
import ChapterDetail from './pages/Chapters/ChapterDetail'
import Lesson from './pages/Lessons/Lesson'
import Flashcards from './pages/Flashcards/Flashcards'
import Achievements from './pages/Achievements/Achievements'
import Leaderboard from './pages/Leaderboard/Leaderboard'
import Settings from './pages/Settings/Settings'
import Review from './pages/Review/Review'
import Quests from './pages/Quests/Quests'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function App() {
  const { isAuthenticated, token } = useAuthStore()
  const resetGameStore = useGameStore((state) => state.reset)

  useEffect(() => {
    // Reset game store when user logs out
    if (!isAuthenticated) {
      resetGameStore()
    }
  }, [isAuthenticated, resetGameStore])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </PublicRoute>
      } />
      
      <Route path="/signup" element={
        <PublicRoute>
          <AuthLayout>
            <Signup />
          </AuthLayout>
        </PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chapters" element={<Chapters />} />
        <Route path="chapters/:id" element={<ChapterDetail />} />
        <Route path="lessons/:id" element={<Lesson />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="quests" element={<Quests />} />
        <Route path="review" element={<Review />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default App