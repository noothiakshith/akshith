import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Lock, CheckCircle, Clock } from 'lucide-react'
import { chaptersAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import toast from 'react-hot-toast'

const Chapters = () => {
  const [loading, setLoading] = useState(true)
  const { chapters, setChapters } = useGameStore()

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await chaptersAPI.getAll()
        setChapters(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        toast.error('Failed to load chapters')
        setChapters([])
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [setChapters])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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

  const getChapterStatus = (chapter) => {
    // This would be based on user progress data
    // For now, we'll use a simple logic
    if (chapter.isUnlocked) {
      return 'available'
    }
    return 'locked'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'available':
        return <BookOpen className="h-5 w-5 text-primary-500" />
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
        <p className="mt-2 text-gray-600">
          Progress through structured lessons to master French
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(chapters) && chapters.map((chapter) => {
          const status = getChapterStatus(chapter)
          const isAccessible = status !== 'locked'

          return (
            <div key={chapter.id} className="card overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(chapter.level)}`}>
                    {chapter.level}
                  </span>
                  {getStatusIcon(status)}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {chapter.title}
                </h3>
                
                {chapter.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {chapter.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Chapter {chapter.order}
                  </div>
                  
                  {status === 'locked' && (
                    <div className="text-xs text-gray-500">
                      Requires {chapter.xpRequired} XP
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  {isAccessible ? (
                    <Link
                      to={`/chapters/${chapter.id}`}
                      className="btn-primary w-full text-center"
                    >
                      {status === 'completed' ? 'Review' : 'Start Chapter'}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="btn w-full bg-gray-100 text-gray-400 cursor-not-allowed"
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

      {(!Array.isArray(chapters) || chapters.length === 0) && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No chapters available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Chapters will appear here once they're created.
          </p>
        </div>
      )}
    </div>
  )
}

export default Chapters