import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Brain, Trophy, TrendingUp, Clock, Target } from 'lucide-react'
import { dashboardAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const { dashboardData, setDashboardData } = useGameStore()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getDashboard()
        setDashboardData(response.data)
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [setDashboardData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total XP',
      value: user?.xp || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Coins',
      value: user?.coins || 0,
      icon: Target,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Current Streak',
      value: user?.streak || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Lessons Completed',
      value: dashboardData?.completedLessons || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  const quickActions = [
    {
      name: 'Continue Learning',
      description: 'Resume your current lesson',
      href: '/chapters',
      icon: BookOpen,
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      name: 'Review Flashcards',
      description: 'Practice with spaced repetition',
      href: '/flashcards',
      icon: Brain,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      name: 'View Achievements',
      description: 'See your progress and rewards',
      href: '/achievements',
      icon: Trophy,
      color: 'bg-yellow-600 hover:bg-yellow-700',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour, {user?.name || 'Learner'}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to continue your French learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="card p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${action.color} rounded-md p-3 transition-colors`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {dashboardData?.recentActivity && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="card">
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard