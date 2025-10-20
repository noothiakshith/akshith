import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react'

const JumbleQuest = ({ quest, onComplete, isCompleted }) => {
  const [availableWords, setAvailableWords] = useState([])
  const [selectedWords, setSelectedWords] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (quest.options?.words) {
      // Shuffle the words
      const shuffled = [...quest.options.words].sort(() => Math.random() - 0.5)
      setAvailableWords(shuffled.map((word, index) => ({ id: index, text: word })))
    }
  }, [quest])

  const handleWordClick = (word, fromAvailable = true) => {
    if (isCompleted || isSubmitting) return

    if (fromAvailable) {
      // Move from available to selected
      setAvailableWords(prev => prev.filter(w => w.id !== word.id))
      setSelectedWords(prev => [...prev, word])
    } else {
      // Move from selected back to available
      setSelectedWords(prev => prev.filter(w => w.id !== word.id))
      setAvailableWords(prev => [...prev, word])
    }
  }

  const handleSubmit = async () => {
    if (selectedWords.length === 0 || isSubmitting || isCompleted) return

    setIsSubmitting(true)
    
    const answerString = selectedWords.map(word => word.text).join(' ')
    const response = await onComplete(quest.id, answerString)
    setResult(response)
    setIsSubmitting(false)

    if (!response.isCorrect) {
      // Reset after showing error for a moment
      setTimeout(() => {
        handleReset()
        setResult(null)
      }, 3000)
    }
  }

  const handleReset = () => {
    if (quest.options?.words) {
      const shuffled = [...quest.options.words].sort(() => Math.random() - 0.5)
      setAvailableWords(shuffled.map((word, index) => ({ id: index, text: word })))
      setSelectedWords([])
      setResult(null)
    }
  }

  return (
    <div className={`card p-6 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-green-600">J</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Jumbled Sentence</h3>
            <p className="text-sm text-gray-500">
              Difficulty: <span className="capitalize">{quest.difficulty || 'medium'}</span>
            </p>
          </div>
        </div>
        
        {isCompleted && (
          <CheckCircle className="h-6 w-6 text-green-500" />
        )}
      </div>

      <div className="mb-6">
        <p className="text-gray-900 mb-2">{quest.question}</p>
        <p className="text-sm text-gray-600">
          Click on the words below to arrange them in the correct order.
        </p>
      </div>

      {/* Available Words */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Available Words</h4>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          {availableWords.map((word) => (
            <button
              key={word.id}
              onClick={() => handleWordClick(word, true)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer"
              disabled={isCompleted || isSubmitting}
            >
              {word.text}
            </button>
          ))}
          {availableWords.length === 0 && (
            <div className="text-gray-400 text-sm italic">
              All words have been used
            </div>
          )}
        </div>
      </div>

      {/* Selected Words (Sentence) */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Your Sentence</h4>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-primary-50 rounded-lg border-2 border-dashed border-primary-200">
          {selectedWords.map((word, index) => (
            <div key={word.id} className="flex items-center">
              <button
                onClick={() => handleWordClick(word, false)}
                className="px-3 py-2 bg-primary-100 border border-primary-300 rounded-lg hover:bg-primary-200 transition-all cursor-pointer"
                disabled={isCompleted || isSubmitting}
              >
                {word.text}
              </button>
              {index < selectedWords.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
              )}
            </div>
          ))}
          {selectedWords.length === 0 && (
            <div className="text-gray-400 text-sm italic">
              Click words above to build your sentence
            </div>
          )}
        </div>
      </div>

      {/* Current Sentence Preview */}
      {selectedWords.length > 0 && (
        <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current sentence:</div>
          <div className="text-lg font-medium text-gray-900">
            "{selectedWords.map(word => word.text).join(' ')}"
          </div>
        </div>
      )}

      {result && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${
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
              ? 'Perfect! Sentence arranged correctly!' 
              : `Incorrect. The correct sentence was: "${result.correctAnswer}"`
            }
          </span>
        </div>
      )}

      {!isCompleted && (
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length === 0 || isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Checking...' : 'Submit Sentence'}
          </button>
          
          <button
            onClick={handleReset}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Shuffle Again
          </button>
          
          <div className="text-sm text-gray-500">
            Reward: +{quest.xpReward || 5} XP
          </div>
        </div>
      )}
    </div>
  )
}

export default JumbleQuest