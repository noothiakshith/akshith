import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, X } from 'lucide-react'
import { lessonsAPI, questsAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import toast from 'react-hot-toast'

const Lesson = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const { currentLesson, setCurrentLesson } = useGameStore()

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await lessonsAPI.getById(id)
        setCurrentLesson(response.data)
      } catch (error) {
        toast.error('Failed to load lesson')
        navigate('/chapters')
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id, setCurrentLesson, navigate])

  const handleSubmitAnswer = async () => {
    if (!currentLesson?.quests?.[currentQuestIndex]) return

    const quest = currentLesson.quests[currentQuestIndex]
    const answer = quest.type === 'multiple_choice' ? selectedOption : userAnswer

    if (!answer.trim()) {
      toast.error('Please provide an answer')
      return
    }

    setSubmitting(true)

    try {
      const response = await questsAPI.submitAnswer(quest.id, { userAnswer: answer })
      setIsCorrect(response.data.correct)
      setShowResult(true)
      
      if (response.data.correct) {
        toast.success('Correct! Well done!')
      } else {
        toast.error('Not quite right. Try again!')
      }
    } catch (error) {
      toast.error('Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuest = () => {
    if (currentQuestIndex < currentLesson.quests.length - 1) {
      setCurrentQuestIndex(currentQuestIndex + 1)
      setUserAnswer('')
      setSelectedOption('')
      setShowResult(false)
      setIsCorrect(false)
    } else {
      // Lesson completed
      toast.success('Lesson completed!')
      navigate('/chapters')
    }
  }

  const handlePreviousQuest = () => {
    if (currentQuestIndex > 0) {
      setCurrentQuestIndex(currentQuestIndex - 1)
      setUserAnswer('')
      setSelectedOption('')
      setShowResult(false)
      setIsCorrect(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Lesson not found</h3>
        <button onClick={() => navigate('/chapters')} className="mt-4 btn-primary">
          Back to Chapters
        </button>
      </div>
    )
  }

  const currentQuest = currentLesson.quests?.[currentQuestIndex]
  const progress = ((currentQuestIndex + 1) / (currentLesson.quests?.length || 1)) * 100

  const renderQuestContent = () => {
    if (!currentQuest) return null

    switch (currentQuest.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuest.question}
            </h3>
            <div className="space-y-2">
              {currentQuest.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedOption === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 'fill_blank':
      case 'translate':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuest.question}
            </h3>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="input w-full"
              placeholder="Type your answer here..."
              disabled={showResult}
            />
            {currentQuest.hint && (
              <p className="text-sm text-gray-500">
                💡 Hint: {currentQuest.hint}
              </p>
            )}
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuest.question}
            </h3>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="input w-full"
              placeholder="Type your answer here..."
              disabled={showResult}
            />
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/chapters')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 mx-4">
          <h1 className="text-xl font-semibold text-gray-900 text-center">
            {currentLesson.title}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {currentQuestIndex + 1} / {currentLesson.quests?.length || 0}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Lesson Content */}
      {currentLesson.content && !currentQuest && (
        <div className="card p-8">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setCurrentQuestIndex(0)}
              className="btn-primary"
            >
              Start Practice
            </button>
          </div>
        </div>
      )}

      {/* Quest */}
      {currentQuest && (
        <div className="card p-8">
          {renderQuestContent()}

          {/* Result */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <span className={`font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              {!isCorrect && (
                <p className="mt-2 text-sm text-red-700">
                  The correct answer is: <strong>{currentQuest.answer}</strong>
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handlePreviousQuest}
              disabled={currentQuestIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting || (!userAnswer.trim() && !selectedOption)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Checking...' : 'Check Answer'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuest}
                  className="btn-primary"
                >
                  {currentQuestIndex < (currentLesson.quests?.length || 0) - 1 ? (
                    <>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'Complete Lesson'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No quests available */}
      {(!currentLesson.quests || currentLesson.quests.length === 0) && (
        <div className="card p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No practice questions available
          </h3>
          <p className="text-gray-600 mb-4">
            This lesson doesn't have any practice questions yet.
          </p>
          <button
            onClick={() => navigate('/chapters')}
            className="btn-primary"
          >
            Back to Chapters
          </button>
        </div>
      )}
    </div>
  )
}

export default Lesson