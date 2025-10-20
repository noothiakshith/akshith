import { useEffect, useState } from 'react'
import { Trophy, Lock, Calendar } from 'lucide-react'
import { achievementsAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import toast from 'react-hot-toast'

const Achievements = () => {
  const [loading, setLoading] = useState(true)
  const { achievements, setAchievements } = useGameStore()

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await achievementsAPI.getAll()
        setAchievements(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        toast.error('Failed to load achievements')
        setAchievements([])
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [setAchievements])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'streak':
        return 'bg-orange-100 text-orange-800'
      case 'xp':
        return 'bg-blue-100 text-blue-800'
      case 'accuracy':
        return 'bg-green-100 text-green-800'
      case 'completion':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        <p className="mt-2 text-gray-600">
          Track your progress and unlock rewards
        </p>
      </div>

      {Array.isArray(achievements) && achievements.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((userAchievement) => {
            const achievement = userAchievement.achievement
            
            return (
              <div key={userAchievement.id} className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      {achievement.icon ? (
                        <span className="text-2xl">{achievement.icon}</span>
                      ) : (
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {achievement.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                        {achievement.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {achievement.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(userAchievement.unlockedAt)}
                      </div>
                      <div className="flex items-center text-yellow-600">
                        <span className="font-medium">+{achievement.coinReward} coins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No achievements yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Keep learning to unlock your first achievement!
          </p>
        </div>
      )}
    </div>
  )
}

export default Achievements