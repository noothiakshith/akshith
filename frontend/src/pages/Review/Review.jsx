import { useEffect, useState } from 'react'
import { RotateCcw, CheckCircle, X, ArrowRight } from 'lucide-react'
import { reviewAPI } from '../../services/api'
import toast from 'react-hot-toast'

const Review = () => {
  const [loading, setLoading] = useState(false)
  const [reviewSession, setReviewSession] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const startReviewSession = async () => {
    setLoading(true)
    try {
      const response = await reviewAPI.start()
      // Backend returns array of questions directly, wrap in session object
      setReviewSession({
        id: Date.now(), // Generate a temporary session ID
        questions: response.data
      })
      setCurrentQuestionIndex(0)
      setSessionComplete(false)
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('No mistakes available to review. Great job!')
      } else {
        toast.error('Failed to start review session')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!reviewSession?.questions?.[currentQuestionIndex]) return

    const question = reviewSession.questions[currentQuestionIndex]
    const answer = question.type === 'multiple_choice' ? selectedOption : userAnswer

    if (!answer.trim()) {
      toast.error('Please provide an answer')
      return
    }

    setSubmitting(true)

    try {
      const response = await reviewAPI.submit({
        mistakeId: question.mistakeId,
        userAnswer: answer
      })
      
      setIsCorrect(response.data.isCorrect)
      setShowResult(true)
      
      if (response.data.isCorrect) {
        toast.success('Correct!')
      } else {
        toast.error('Incorrect')
      }
    } catch (error) {
      toast.error('Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < reviewSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer('')
      setSelectedOption('')
      setShowResult(false)
      setIsCorrect(false)
    } else {
      setSessionComplete(true)
      toast.success('Review session completed!')
    }
  }

  const resetSession = () => {
    setReviewSession(null)
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setSelectedOption('')
    setShowResult(false)
    setIsCorrect(false)
    setSessionComplete(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!reviewSession) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <RotateCcw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Session</h1>
        <p className="text-gray-600 mb-6">
          Practice questions from your mistakes and previous lessons
        </p>
        <button
          onClick={startReviewSession}
          className="btn-primary"
        >
          Start Review Session
        </button>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h1>
        <p className="text-gray-600 mb-6">
          Great job! You've completed this review session.
        </p>
        <div className="space-x-4">
          <button
            onClick={startReviewSession}
            className="btn-primary"
          >
            Start New Session
          </button>
          <button
            onClick={resetSession}
            className="btn-secondary"
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = reviewSession.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / reviewSession.questions.length) * 100

  const renderQuestionContent = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>
            <div className="space-y-2">
              {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((option, index) => (
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
              ))
            ) : (
              <p className="text-sm text-red-500">No options available for this question</p>
            )}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="input w-full"
              placeholder="Type your answer here..."
              disabled={showResult}
            />
            {currentQuestion.hint && (
              <p className="text-sm text-gray-500">
                💡 Hint: {currentQuestion.hint}
              </p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Review Session</h1>
        <p className="mt-2 text-gray-600">
          Question {currentQuestionIndex + 1} of {reviewSession.questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="card p-8">
        {renderQuestionContent()}

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
                The correct answer will be shown after submission.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <div></div>
          
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
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              {currentQuestionIndex < reviewSession.questions.length - 1 ? (
                <>
                  Next Question <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Complete Session'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Review