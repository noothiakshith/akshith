import { useEffect, useState } from 'react'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { leaderboardAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const Leaderboard = () => {
  const [loading, setLoading] = useState(true)
  const { leaderboard, setLeaderboard } = useGameStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.get()
        // Handle both direct array and wrapped object responses
        const leaderboardData = response.data.leaderboard || response.data
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : [])
      } catch (error) {
        console.error('Leaderboard error:', error)
        toast.error('Failed to load leaderboard: ' + (error.response?.data?.message || error.message))
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [setLeaderboard])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const isCurrentUser = (leaderboardUser) => {
    return leaderboardUser.id === user?.id
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="mt-2 text-gray-600">
          See how you rank among other French learners
        </p>
      </div>

      {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
        <div className="space-y-4">
          {leaderboard.map((leaderboardUser, index) => {
            const rank = index + 1
            const isMe = isCurrentUser(leaderboardUser)
            
            return (
              <div
                key={leaderboardUser.id}
                className={`card p-6 ${getRankBg(rank)} ${
                  isMe ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {leaderboardUser.name || 'Anonymous'}
                        {isMe && (
                          <span className="ml-2 text-sm text-primary-600 font-medium">
                            (You)
                          </span>
                        )}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                        {leaderboardUser.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{leaderboardUser.xp}</span>
                        <span>XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-orange-500">🔥</span>
                        <span className="font-medium">{leaderboardUser.streak}</span>
                        <span>day streak</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-medium">{leaderboardUser.coins}</span>
                        <span>coins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {leaderboardUser.xp}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total XP
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">No leaderboard data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start learning to appear on the leaderboard!
          </p>
        </div>
      )}

      {/* Your current position if not in top list */}
      {user && Array.isArray(leaderboard) && !leaderboard.some(u => u.id === user.id) && (
        <div className="card p-6 bg-primary-50 border-primary-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Your Current Stats
            </h3>
            <div className="flex justify-center space-x-6 text-sm">
              <div>
                <div className="text-xl font-bold text-primary-900">{user.xp}</div>
                <div className="text-primary-700">XP</div>
              </div>
              <div>
                <div className="text-xl font-bold text-primary-900">{user.streak}</div>
                <div className="text-primary-700">Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold text-primary-900">{user.coins}</div>
                <div className="text-primary-700">Coins</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-primary-700">
              Keep learning to climb the leaderboard!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard