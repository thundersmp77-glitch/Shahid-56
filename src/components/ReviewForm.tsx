'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { Star } from 'lucide-react'

export function ReviewForm() {
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('Please enter a review message')
      return
    }

    setSubmitting(true)
    try {
      await axios.post('/api/reviews', { rating, message })
      toast.success('Review submitted successfully!')
      setMessage('')
      setRating(5)
      router.refresh()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star 
                size={24} 
                className={star <= rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Your Review</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none"
          placeholder="Tell us about your experience..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/20"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
