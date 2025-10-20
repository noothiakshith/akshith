import { create } from 'zustand'

const useGameStore = create((set, get) => ({
  // Dashboard data
  dashboardData: null,
  
  // Chapters and lessons
  chapters: [],
  currentChapter: null,
  currentLesson: null,
  
  // Progress tracking
  progress: {},
  
  // Flashcards
  reviewFlashcards: [],
  
  // Achievements
  achievements: [],
  
  // Leaderboard
  leaderboard: [],
  
  // Settings
  settings: null,
  
  // Actions
  setDashboardData: (data) => set({ dashboardData: data }),
  
  setChapters: (chapters) => set({ chapters }),
  
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  
  updateProgress: (lessonId, progressData) => set((state) => ({
    progress: {
      ...state.progress,
      [lessonId]: progressData
    }
  })),
  
  setReviewFlashcards: (flashcards) => set({ reviewFlashcards: flashcards }),
  
  setAchievements: (achievements) => set({ achievements }),
  
  setLeaderboard: (leaderboard) => set({ leaderboard: Array.isArray(leaderboard) ? leaderboard : [] }),
  
  setSettings: (settings) => set({ settings }),
  
  // Reset store
  reset: () => set({
    dashboardData: null,
    chapters: [],
    currentChapter: null,
    currentLesson: null,
    progress: {},
    reviewFlashcards: [],
    achievements: [],
    leaderboard: [],
    settings: null,
  }),
}))

export default useGameStore