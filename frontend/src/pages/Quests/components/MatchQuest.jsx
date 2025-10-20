import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

const MatchQuest = ({ quest, onComplete, isCompleted }) => {
  const [pairs, setPairs] = useState([])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matches, setMatches] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (quest.options?.pairs) {
      // Shuffle the right side items
      const leftItems = quest.options.pairs.map((pair, index) => ({
        id: index,
        text: pair.french,
        type: 'left'
      }))
      
      const rightItems = [...quest.options.pairs]
        .sort(() => Math.random() - 0.5)
        .map((pair, index) => ({
          id: index,
          text: pair.english,
          type: 'right',
          originalIndex: quest.options.pairs.findIndex(p => p.english === pair.english)
        }))

      setPairs({ left: leftItems, right: rightItems })
    }
  }, [quest])

  const handleItemClick = (item) => {
    if (isCompleted || isSubmitting) return

    if (item.type === 'left') {
      setSelectedLeft(selectedLeft?.id === item.id ? null : item)
    } else {
      setSelectedRight(selectedRight?.id === item.id ? null : item)
    }
  }

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      // Check if this is a correct match
      const leftIndex = selectedLeft.id
      const rightOriginalIndex = selectedRight.originalIndex
      
      if (leftIndex === rightOriginalIndex) {
        // Correct match
        setMatches(prev => [...prev, { left: selectedLeft, right: selectedRight }])
        setSelectedLeft(null)
        setSelectedRight(null)
      } else {
        // Incorrect match - clear selection after a brief delay
        setTimeout(() => {
          setSelectedLeft(null)
          setSelectedRight(null)
        }, 1000)
      }
    }
  }, [selectedLeft, selectedRight])

  const handleSubmit = async () => {
    if (matches.length !== pairs.left?.length || isSubmitting || isCompleted) return

    setIsSubmitting(true)
    
    // Create answer string in the expected format
    const answerString = matches
      .sort((a, b) => a.left.id - b.left.id)
      .map(match => `${match.left.text}-${match.right.text}`)
      .join(',')

    const response = await onComplete(quest.id, answerString)
    setResult(response)
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setMatches([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setResult(null)
  }

  const isItemMatched = (item) => {
    return matches.some(match => 
      match.left.id === item.id || match.right.id === item.id
    )
  }

  const isItemSelected = (item) => {
    return (item.type === 'left' && selectedLeft?.id === item.id) ||
           (item.type === 'right' && selectedRight?.id === item.id)
  }

  const getItemStyle = (item) => {
    if (isItemMatched(item)) {
      return 'bg-green-100 border-green-300 text-green-800 cursor-default'
    }
    if (isItemSelected(item)) {
      return 'bg-primary-100 border-primary-300 text-primary-800'
    }
    return 'bg-white border-gray-200 hover:border-gray-300 cursor-pointer'
  }

  return (
    <div className={`card p-6 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-purple-600">M</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Match the Pairs</h3>
            <p className="text-sm text-gray-500">
              Difficulty: <span className="capitalize">{quest.difficulty || 'medium'}</span>
            </p>
          </div>
        </div>
        
        {isCompleted && (
          <CheckCircle className="h-6 w-6 text-green-500" />
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-900">{quest.question}</p>
      </div>

      {pairs.left && pairs.right && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 mb-3">French</h4>
            {pairs.left.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3 rounded-lg border-2 transition-all ${getItemStyle(item)}`}
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 mb-3">English</h4>
            {pairs.right.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3 rounded-lg border-2 transition-all ${getItemStyle(item)}`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{matches.length} / {pairs.left?.length || 0} matched</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${(matches.length / (pairs.left?.length || 1)) * 100}%` }}
          />
        </div>
      </div>

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
              ? 'Perfect! All pairs matched correctly!' 
              : 'Some matches were incorrect. Try again!'
            }
          </span>
        </div>
      )}

      {!isCompleted && (
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSubmit}
            disabled={matches.length !== pairs.left?.length || isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Checking...' : 'Submit Matches'}
          </button>
          
          <button
            onClick={handleReset}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          
          <div className="text-sm text-gray-500">
            Reward: +{quest.xpReward || 5} XP
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchQuest