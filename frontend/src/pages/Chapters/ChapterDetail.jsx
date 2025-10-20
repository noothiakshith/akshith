import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Play, CheckCircle, Clock, Lock } from 'lucide-react'
import { chaptersAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import toast from 'react-hot-toast'

const ChapterDetail = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const { currentChapter, setCurrentChapter } = useGameStore()

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await chaptersAPI.getById(id)
        setCurrentChapter(response.data)
      } catch (error) {
        toast.error('Failed to load chapter')
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [id, setCurrentChapter])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentChapter) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Chapter not found</h3>
        <Link to="/chapters" className="mt-4 btn-primary">
          Back to Chapters
        </Link>
      </div>
    )
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLessonStatus = (lesson) => {
    // This would be based on user progress data
    // For now, we'll use a simple logic based on lesson order
    return 'available' // or 'completed', 'in-progress', 'locked'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'available':
        return <Play className="h-5 w-5 text-primary-500" />
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/chapters"
          className="btn-ghost p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentChapter.title}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(currentChapter.level)}`}>
              {currentChapter.level}
            </span>
          </div>
          {currentChapter.description && (
            <p className="text-gray-600">{currentChapter.description}</p>
          )}
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Lessons ({currentChapter.lessons?.length || 0})
        </h2>
        
        <div className="space-y-4">
          {currentChapter.lessons?.map((lesson) => {
            const status = getLessonStatus(lesson)
            const isAccessible = status !== 'locked'

            return (
              <div key={lesson.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>Lesson {lesson.order}</span>
                        <span>•</span>
                        <span>{lesson.xpReward} XP</span>
                        <span>•</span>
                        <span>{lesson.coinReward} coins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    {isAccessible ? (
                      <Link
                        to={`/lessons/${lesson.id}`}
                        className="btn-primary"
                      >
                        {status === 'completed' ? 'Review' : 'Start'}
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="btn bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {(!currentChapter.lessons || currentChapter.lessons.length === 0) && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No lessons available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Lessons will appear here once they're created for this chapter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterDetail