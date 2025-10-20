import { useState, useEffect } from 'react'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  BarChart3
} from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdaptiveDashboard = () => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchInsights()
    fetchAnalytics()
  }, [])

  const fetchInsights = async () => {
    try {
      const response = await api.get('/dashboard/insights')
      setInsights(response.data)
    } catch (error) {
      console.error('Error fetching insights:', error)
      toast.error('Failed to load learning insights')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/user-learning?timeframe=30d')
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const triggerAdaptiveLearning = async () => {
    try {
      setLoading(true)
      await api.post('/dashboard/adaptive-learning')
      toast.success('Adaptive learning analysis completed!')
      fetchInsights()
    } catch (error) {
      console.error('Error triggering adaptive learning:', error)
      toast.error('Failed to trigger adaptive learning')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No insights available</h3>
        <p className="mt-1 text-sm text-gray-500">Complete some lessons to see your learning insights.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Adaptive Learning Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your personalized learning journey powered by AI
          </p>
        </div>
        <button
          onClick={triggerAdaptiveLearning}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          <Brain className="h-4 w-4" />
          <span>{loading ? 'Analyzing...' : 'Refresh Analysis'}</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Accuracy</p>
              <p className="text-2xl font-semibold text-gray-900">
                {insights.overallAccuracy?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lessons Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {insights.completedLessons || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="text-2xl font-semibold text-gray-900">
                {insights.streak || 0} days
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total XP</p>
              <p className="text-2xl font-semibold text-gray-900">
                {insights.xp || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
            Areas for Improvement
          </h3>
          {insights.weakAreas && insights.weakAreas.length > 0 ? (
            <div className="space-y-3">
              {insights.weakAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800 capitalize">
                    {area.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-orange-600">
                    {insights.mistakeCategories[area] || 0} mistakes
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No specific weak areas identified. Keep up the great work!</p>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Recent Achievements
          </h3>
          {insights.recentAchievements && insights.recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {insights.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {achievement.achievement.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Complete lessons to unlock achievements!</p>
          )}
        </div>
      </div>

      {/* Next Goals */}
      {insights.nextGoal && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-blue-500 mr-2" />
            Next Goal
          </h3>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-800">
                Unlock: {insights.nextGoal.title}
              </p>
              <p className="text-xs text-blue-600">
                {insights.nextGoal.xpNeeded} XP needed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(0, insights.nextGoal.xpNeeded)}
              </div>
              <div className="text-xs text-blue-500">XP to go</div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
            Learning Analytics (30 days)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.totalTimeSpent || 0}
              </div>
              <div className="text-sm text-purple-500">Minutes studied</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.achievementsUnlocked || 0}
              </div>
              <div className="text-sm text-purple-500">Achievements</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.currentStreak || 0}
              </div>
              <div className="text-sm text-purple-500">Day streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Adaptive Learning Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 text-blue-500 mr-2" />
          AI Learning Assistant
        </h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Continuously analyzing your progress and mistakes</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Generating personalized content based on your weak areas</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2" />
            <span>Adjusting difficulty to match your learning pace</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdaptiveDashboard
