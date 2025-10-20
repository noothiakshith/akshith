import { useState } from 'react'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'

const FillBlankQuest = ({ quest, onComplete, isCompleted }) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userAnswer.trim() || isSubmitting || isCompleted) return

    setIsSubmitting(true)
    const response = await onComplete(quest.id, userAnswer.trim())
    setResult(response)
    setIsSubmitting(false)

    if (!response.isCorrect) {
      // Clear the input for retry
      setTimeout(() => {
        setUserAnswer('')
        setResult(null)
      }, 3000)
    }
  }

  const renderQuestion = () => {
    const parts = quest.question.split('__')
    if (parts.length === 1) {
      // No blank found, treat the whole thing as having a blank at the end
      return (
        <span>
          {quest.question}{' '}
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="inline-block w-32 px-2 py-1 border-b-2 border-primary-500 bg-transparent focus:outline-none focus:border-primary-600"
            placeholder="..."
            disabled={isCompleted || isSubmitting}
          />
        </span>
      )
    }

    return (
      <span>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="inline-block w-32 px-2 py-1 border-b-2 border-primary-500 bg-transparent focus:outline-none focus:border-primary-600"
                placeholder="..."
                disabled={isCompleted || isSubmitting}
              />
            )}
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className={`card p-6 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">FB</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Fill in the Blank</h3>
            <p className="text-sm text-gray-500">
              Difficulty: <span className="capitalize">{quest.difficulty || 'medium'}</span>
            </p>
          </div>
        </div>
        
        {isCompleted && (
          <CheckCircle className="h-6 w-6 text-green-500" />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-lg text-gray-900">
          {renderQuestion()}
        </div>

        {quest.hint && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{showHint ? 'Hide' : 'Show'} Hint</span>
            </button>
          </div>
        )}

        {showHint && quest.hint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">{quest.hint}</p>
          </div>
        )}

        {result && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            result.isCorrect 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {result.isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">
              {result.isCorrect 
                ? 'Correct! Well done!' 
                : `Incorrect. The answer was: ${result.correctAnswer}`
              }
            </span>
          </div>
        )}

        {!isCompleted && (
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={!userAnswer.trim() || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Checking...' : 'Submit Answer'}
            </button>
            
            <div className="text-sm text-gray-500">
              Reward: +{quest.xpReward || 5} XP
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default FillBlankQuest