import { useEffect, useState } from 'react'
import { Brain, Target, Shuffle, CheckCircle, XCircle } from 'lucide-react'
import { questsAPI } from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import FillBlankQuest from './components/FillBlankQuest'
import MatchQuest from './components/MatchQuest'
import JumbleQuest from './components/JumbleQuest'

const Quests = () => {
  const [loading, setLoading] = useState(true)
  const [quests, setQuests] = useState({ fill_blank: [], match: [], jumble: [] })
  const [activeTab, setActiveTab] = useState('fill_blank')
  const [completedQuests, setCompletedQuests] = useState(new Set())
  const { user, updateUser } = useAuthStore()

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        console.log('Fetching quests...')
        const response = await questsAPI.getAll()
        console.log('Quests response:', response.data)
        setQuests(response.data.quests || { fill_blank: [], match: [], jumble: [] })
      } catch (error) {
        console.error('Quests error:', error)
        toast.error('Failed to load quests: ' + (error.response?.data?.message || error.message))
      } finally {
        setLoading(false)
      }
    }

    fetchQuests()
  }, [])

  const handleQuestComplete = async (questId, userAnswer) => {
    try {
      const response = await questsAPI.submitAnswer(questId, { userAnswer })
      
      if (response.data.isCorrect) {
        setCompletedQuests(prev => new Set([...prev, questId]))
        toast.success(`Correct! +${response.data.xpEarned || 5} XP`)
        
        // Update user XP
        if (response.data.xpEarned) {
          updateUser({ 
            xp: (user?.xp || 0) + response.data.xpEarned,
            coins: (user?.coins || 0) + (response.data.coinsEarned || 0)
          })
        }
      } else {
        toast.error(`Incorrect. The answer was: ${response.data.correctAnswer}`)
      }
      
      return response.data
    } catch (error) {
      console.error('Quest submission error:', error)
      toast.error('Failed to submit answer')
      return { isCorrect: false }
    }
  }

  const questTypes = [
    {
      id: 'fill_blank',
      name: 'Fill in the Blanks',
      icon: Target,
      description: 'Complete the missing words',
      color: 'bg-blue-500',
      count: quests.fill_blank?.length || 0
    },
    {
      id: 'match',
      name: 'Match the Pairs',
      icon: Brain,
      description: 'Connect related items',
      color: 'bg-purple-500',
      count: quests.match?.length || 0
    },
    {
      id: 'jumble',
      name: 'Jumbled Sentences',
      icon: Shuffle,
      description: 'Arrange words correctly',
      color: 'bg-green-500',
      count: quests.jumble?.length || 0
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const renderQuestComponent = (quest) => {
    const isCompleted = completedQuests.has(quest.id)
    
    switch (quest.type) {
      case 'fill_blank':
        return (
          <FillBlankQuest
            key={quest.id}
            quest={quest}
            onComplete={handleQuestComplete}
            isCompleted={isCompleted}
          />
        )
      case 'match':
        return (
          <MatchQuest
            key={quest.id}
            quest={quest}
            onComplete={handleQuestComplete}
            isCompleted={isCompleted}
          />
        )
      case 'jumble':
        return (
          <JumbleQuest
            key={quest.id}
            quest={quest}
            onComplete={handleQuestComplete}
            isCompleted={isCompleted}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">French Quests</h1>
        <p className="mt-2 text-gray-600">
          Practice your French with interactive challenges
        </p>
      </div>

      {/* Quest Type Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id)}
            className={`card p-6 text-left transition-all ${
              activeTab === type.id
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`${type.color} rounded-lg p-3`}>
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {type.count} quest{type.count !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Quest Type Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {questTypes.find(t => t.id === activeTab)?.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              {Array.from(completedQuests).filter(id => 
                quests[activeTab]?.some(q => q.id === id)
              ).length} / {quests[activeTab]?.length || 0} completed
            </span>
          </div>
        </div>

        {quests[activeTab]?.length > 0 ? (
          <div className="space-y-4">
            {quests[activeTab].map(renderQuestComponent)}
          </div>
        ) : (
          <div className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No quests available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for new {questTypes.find(t => t.id === activeTab)?.name.toLowerCase()} challenges!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quests