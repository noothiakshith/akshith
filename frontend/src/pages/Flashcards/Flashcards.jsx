import { useEffect, useState } from 'react'
import { Brain, RotateCcw, CheckCircle, X } from 'lucide-react'
import { flashcardsAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import toast from 'react-hot-toast'

const Flashcards = () => {
  const [loading, setLoading] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  
  const { reviewFlashcards, setReviewFlashcards } = useGameStore()

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardsAPI.getReview()
        setReviewFlashcards(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        toast.error('Failed to load flashcards')
        setReviewFlashcards([])
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcards()
  }, [setReviewFlashcards])

  const handleReview = async (difficulty) => {
    if (!reviewFlashcards[currentCardIndex]) return

    setReviewing(true)
    
    try {
      const flashcard = reviewFlashcards[currentCardIndex]
      await flashcardsAPI.submitReview(flashcard.id, { difficulty })
      
      // Move to next card or finish
      if (currentCardIndex < reviewFlashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
        setShowAnswer(false)
      } else {
        toast.success('Review session completed!')
        // Refresh flashcards
        const response = await flashcardsAPI.getReview()
        setReviewFlashcards(response.data)
        setCurrentCardIndex(0)
        setShowAnswer(false)
      }
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setReviewing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!Array.isArray(reviewFlashcards) || reviewFlashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No flashcards to review</h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete some lessons to generate flashcards for review.
        </p>
      </div>
    )
  }

  const currentCard = reviewFlashcards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / reviewFlashcards.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Flashcard Review</h1>
        <p className="mt-2 text-gray-600">
          {currentCardIndex + 1} of {reviewFlashcards.length} cards
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="card p-8 min-h-[300px] flex flex-col justify-center">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentCard.front}
            </h2>
            <p className="text-sm text-gray-500">
              Difficulty: {currentCard.difficulty}
            </p>
          </div>

          {showAnswer ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: currentCard.back }} />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">How well did you know this?</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleReview('hard')}
                    disabled={reviewing}
                    className="btn bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Hard
                  </button>
                  <button
                    onClick={() => handleReview('medium')}
                    disabled={reviewing}
                    className="btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Medium
                  </button>
                  <button
                    onClick={() => handleReview('easy')}
                    disabled={reviewing}
                    className="btn bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Easy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="btn-primary"
            >
              Show Answer
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="card p-4">
          <div className="text-2xl font-bold text-gray-900">{currentCard.timesReviewed}</div>
          <div className="text-sm text-gray-500">Times Reviewed</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-gray-900">{currentCard.timesCorrect}</div>
          <div className="text-sm text-gray-500">Times Correct</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-gray-900">
            {currentCard.timesReviewed > 0 
              ? Math.round((currentCard.timesCorrect / currentCard.timesReviewed) * 100)
              : 0}%
          </div>
          <div className="text-sm text-gray-500">Accuracy</div>
        </div>
      </div>
    </div>
  )
}

export default Flashcards